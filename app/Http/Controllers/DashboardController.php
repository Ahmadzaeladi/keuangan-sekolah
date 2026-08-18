<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\CashAccount;
use App\Models\Income;
use App\Models\Expense;
use App\Models\Bill;
use App\Models\Student;

class DashboardController extends Controller {
    public function index() {
        if (request()->user()->role === 'guardian') {
            return redirect()->route('parent.dashboard');
        }
        $saldo = CashAccount::sum('balance');
        $pemasukan = Income::sum('amount');
        $pengeluaran = Expense::sum('amount');
        $tunggakan = Bill::where('status', 'UNPAID')->sum('amount');
        $siswaBelumBayar = Bill::where('status', 'UNPAID')->distinct('student_id')->count('student_id');

        $transactions = collect();
        foreach (Income::with('category')->latest()->take(5)->get() as $i) {
            $transactions->push(['date' => $i->date, 'desc' => $i->description, 'amount' => $i->amount, 'type' => 'in', 'cat' => $i->category->name]);
        }
        foreach (Expense::with('category')->latest()->take(5)->get() as $e) {
            $transactions->push(['date' => $e->date, 'desc' => $e->description, 'amount' => $e->amount, 'type' => 'out', 'cat' => $e->category->name]);
        }
        $transactions = $transactions->sortByDesc('date')->take(5)->values();

        $chartData = [];
        $monthsName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        for ($i = 5; $i >= 0; $i--) {
            $dt = now()->subMonths($i);
            $chartData[] = [
                'name' => $monthsName[$dt->month] . ' ' . $dt->year,
                'pemasukan' => (float) Income::whereMonth('date', $dt->month)->whereYear('date', $dt->year)->sum('amount'),
                'pengeluaran' => (float) Expense::whereMonth('date', $dt->month)->whereYear('date', $dt->year)->sum('amount'),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => compact('saldo', 'pemasukan', 'pengeluaran', 'tunggakan', 'siswaBelumBayar'),
            'transactions' => $transactions,
            'chartData' => $chartData
        ]);
    }
}