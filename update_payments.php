<?php

// Update web.php
$routes = file_get_contents(__DIR__ . '/routes/web.php');
$routes = str_replace(
    "Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');\n    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');",
    "Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');\n    Route::get('/payments/export', [PaymentController::class, 'export'])->name('payments.export');\n    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');",
    $routes
);
file_put_contents(__DIR__ . '/routes/web.php', $routes);


// Create Export Class
if(!is_dir(__DIR__ . '/app/Exports')) mkdir(__DIR__ . '/app/Exports');
$exportClass = <<<EOT
<?php
namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PaymentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Payment::with(['student', 'bill.billType'])->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID Pembayaran',
            'NIS',
            'Nama Siswa',
            'Tagihan',
            'Periode',
            'Nominal',
            'Metode',
            'Tanggal Pembayaran',
            'Status'
        ];
    }

    public function map(\$payment): array
    {
        return [
            \$payment->payment_number,
            \$payment->student->nis,
            \$payment->student->name,
            \$payment->bill->billType->name,
            \$payment->bill->period,
            \$payment->amount,
            \$payment->payment_method,
            \$payment->paid_at ? \Carbon\Carbon::parse(\$payment->paid_at)->format('Y-m-d H:i') : '',
            \$payment->status
        ];
    }

    public function styles(Worksheet \$sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
EOT;
file_put_contents(__DIR__ . '/app/Exports/PaymentsExport.php', $exportClass);


// Update PaymentController.php
$controllerPath = __DIR__ . '/app/Http/Controllers/PaymentController.php';
$content = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Bill;
use App\Models\CashAccount;
use Illuminate\Support\Facades\DB;
use App\Exports\PaymentsExport;
use Maatwebsite\Excel\Facades\Excel;

class PaymentController extends Controller {
    public function index() {
        \$payments = Payment::with(['student', 'bill.billType'])->latest()->paginate(15);
        return Inertia::render('Payments/Index', ['payments' => \$payments]);
    }

    public function export() {
        return Excel::download(new PaymentsExport, 'Laporan_Pembayaran_SIKOLA.xlsx');
    }

    public function store(Request \$request) {
        \$validated = \$request->validate([
            'bill_id' => 'required|exists:bills,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:CASH,TRANSFER,QRIS',
            'notes' => 'nullable|string'
        ]);

        DB::transaction(function() use (\$validated) {
            \$bill = Bill::findOrFail(\$validated['bill_id']);
            
            \$payment = Payment::create([
                'bill_id' => \$bill->id,
                'student_id' => \$bill->student_id,
                'payment_number' => 'PAY-' . date('Ymd') . '-' . rand(100, 999),
                'amount' => \$validated['amount'],
                'payment_method' => \$validated['payment_method'],
                'paid_at' => now(),
                'status' => 'SUCCESS',
                'notes' => \$validated['notes']
            ]);

            \$totalPaid = \$bill->payments()->where('status', 'SUCCESS')->sum('amount');
            if (\$totalPaid >= \$bill->amount) {
                \$bill->update(['status' => 'PAID']);
            } else {
                \$bill->update(['status' => 'PARTIAL']);
            }

            \$cash = CashAccount::first();
            if(\$cash) {
                \$cash->increment('balance', \$validated['amount']);
            }
        });

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function show(Payment \$payment) {
        \$payment->load(['student.studentClass', 'bill.billType']);
        return Inertia::render('Payments/Show', ['payment' => \$payment]);
    }
}
EOT;
file_put_contents($controllerPath, $content);

// Update Payments/Index.tsx
$paymentsIndexTsx = <<<EOT
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Index({ payments }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return (
        <DashboardLayout>
            <Head title="Pembayaran" />
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Pembayaran</h1>
                <div className="flex gap-3">
                    <a href="/payments/export" target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium">Export Excel</a>
                    <Link href="/bills" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">+ Catat Pembayaran</Link>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Metode</th><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {payments.data.map((p: any) => (
                                <tr key={p.id} className="border-b">
                                    <td className="px-6 py-4">{p.payment_number}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{p.student.name}</td>
                                    <td className="px-6 py-4">{p.bill.bill_type.name} - {p.bill.period}</td>
                                    <td className="px-6 py-4 font-medium text-green-600">{formatRp(p.amount)}</td>
                                    <td className="px-6 py-4">{p.payment_method}</td>
                                    <td className="px-6 py-4">{new Date(p.paid_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/payments/\${p.id}`} className="text-blue-600 hover:underline">Kwitansi</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
EOT;
file_put_contents(__DIR__ . '/resources/js/Pages/Payments/Index.tsx', $paymentsIndexTsx);

echo "Export setup completed.\n";
