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

        $fileName = "Laporan_Keuangan_{$year}_{$month}.xlsx";
        
        $data = [];
        $data[] = ['<b>PEMASUKAN</b>', '', '', '', ''];
        $data[] = ['<b>Tanggal</b>', '<b>Kategori</b>', '<b>Deskripsi</b>', '<b>Sumber</b>', '<b>Jumlah</b>'];
        foreach ($incomes as $inc) {
            $data[] = [
                date('d-m-Y', strtotime($inc->date)),
                $inc->category ? $inc->category->name : '',
                $inc->description,
                $inc->source,
                $inc->amount
            ];
        }
        
        $data[] = [];
        $data[] = ['<b>PENGELUARAN</b>', '', '', ''];
        $data[] = ['<b>Tanggal</b>', '<b>Kategori</b>', '<b>Deskripsi</b>', '<b>Jumlah</b>'];
        foreach ($expenses as $exp) {
            $data[] = [
                date('d-m-Y', strtotime($exp->date)),
                $exp->category ? $exp->category->name : '',
                $exp->description,
                $exp->amount
            ];
        }
        
        $xlsx = \Shuchkin\SimpleXLSXGen::fromArray($data);
        return response((string) $xlsx)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"');
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

        $fileName = "Laporan_Pembayaran_Siswa.xlsx";
        
        $data = [];
        $data[] = ['<b>No. Transaksi</b>', '<b>Tanggal Bayar</b>', '<b>NIS</b>', '<b>Nama Siswa</b>', '<b>Kelas</b>', '<b>Jenis Tagihan</b>', '<b>Metode</b>', '<b>Nominal</b>'];
        foreach ($payments as $p) {
            $data[] = [
                $p->payment_number,
                date('d-m-Y H:i:s', strtotime($p->paid_at)),
                (string)($p->student ? $p->student->nis : ''),
                $p->student ? $p->student->name : '',
                $p->student && $p->student->studentClass ? $p->student->studentClass->name : '',
                $p->bill && $p->bill->billType ? $p->bill->billType->name . ' - ' . $p->bill->period : '',
                $p->payment_method,
                $p->amount
            ];
        }

        $xlsx = \Shuchkin\SimpleXLSXGen::fromArray($data);
        return response((string) $xlsx)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"');
    }
}
