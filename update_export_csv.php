<?php

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
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentController extends Controller {
    public function index() {
        \$payments = Payment::with(['student', 'bill.billType'])->latest()->paginate(15);
        return Inertia::render('Payments/Index', ['payments' => \$payments]);
    }

    public function export() {
        \$fileName = 'Laporan_Pembayaran_SIKOLA.csv';
        \$payments = Payment::with(['student', 'bill.billType'])->latest()->get();

        \$headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=\$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        \$columns = ['ID Pembayaran', 'NIS', 'Nama Siswa', 'Tagihan', 'Periode', 'Nominal', 'Metode', 'Tanggal Pembayaran', 'Status'];

        \$callback = function() use(\$payments, \$columns) {
            \$file = fopen('php://output', 'w');
            fputcsv(\$file, \$columns);

            foreach (\$payments as \$payment) {
                \$row = [
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
                fputcsv(\$file, \$row);
            }

            fclose(\$file);
        };

        return response()->stream(\$callback, 200, \$headers);
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

echo "Export replaced with native CSV stream.\n";
