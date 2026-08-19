<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Income;
use App\Models\Expense;
use App\Models\CashAccount;

class ReportController extends Controller
{
    public function finance(Request $request) {
        $month = $request->query('month', date('m'));
        $year = $request->query('year', date('Y'));

        $incomes = Income::with('category')
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->latest('date')
            ->get();

        $expenses = Expense::with('category')
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->latest('date')
            ->get();

        return Inertia::render('Reports/Finance', [
            'incomes' => $incomes,
            'expenses' => $expenses,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    public function payments(Request $request) {
        $query = Payment::with(['student.studentClass', 'bill.billType'])->latest('paid_at');

        if ($search = $request->query('search')) {
            $query->whereHas('student', function($q) use ($search) {
                $q->where('nis', 'like', "%$search%")
                  ->orWhere('name', 'like', "%$search%");
            });
        }

        $payments = $query->paginate(20)->withQueryString();

        return Inertia::render('Reports/Payments', [
            'payments' => $payments,
            'filters' => $request->only('search')
        ]);
    }

    public function exportFinance(Request $request) {
        $month = $request->query('month', date('m'));
        $year = $request->query('year', date('Y'));
        
        $incomes = Income::with('category')->whereMonth('date', $month)->whereYear('date', $year)->latest('date')->get();
        $expenses = Expense::with('category')->whereMonth('date', $month)->whereYear('date', $year)->latest('date')->get();

        $fileName = "Laporan_Keuangan_{$year}_{$month}.csv";
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($incomes, $expenses) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, ['PEMASUKAN']);
            fputcsv($file, ['Tanggal', 'Kategori', 'Deskripsi', 'Sumber', 'Jumlah']);
            foreach ($incomes as $inc) {
                fputcsv($file, [
                    $inc->date,
                    $inc->category ? $inc->category->name : '',
                    $inc->description,
                    $inc->source,
                    $inc->amount
                ]);
            }
            
            fputcsv($file, []);
            fputcsv($file, ['PENGELUARAN']);
            fputcsv($file, ['Tanggal', 'Kategori', 'Deskripsi', 'Jumlah']);
            foreach ($expenses as $exp) {
                fputcsv($file, [
                    $exp->date,
                    $exp->category ? $exp->category->name : '',
                    $exp->description,
                    $exp->amount
                ]);
            }
            
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function exportPayments(Request $request) {
        $query = Payment::with(['student.studentClass', 'bill.billType'])->latest('paid_at');
        
        if ($search = $request->query('search')) {
            $query->whereHas('student', function($q) use ($search) {
                $q->where('nis', 'like', "%$search%")
                  ->orWhere('name', 'like', "%$search%");
            });
        }
        $payments = $query->get();

        $fileName = "Laporan_Pembayaran_Siswa.csv";
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($payments) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['No. Transaksi', 'Tanggal Bayar', 'NIS', 'Nama Siswa', 'Kelas', 'Jenis Tagihan', 'Metode', 'Nominal']);
            foreach ($payments as $p) {
                fputcsv($file, [
                    $p->payment_number,
                    $p->paid_at,
                    $p->student ? $p->student->nis : '',
                    $p->student ? $p->student->name : '',
                    $p->student && $p->student->studentClass ? $p->student->studentClass->name : '',
                    $p->bill && $p->bill->billType ? $p->bill->billType->name . ' - ' . $p->bill->period : '',
                    $p->payment_method,
                    $p->amount
                ]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
