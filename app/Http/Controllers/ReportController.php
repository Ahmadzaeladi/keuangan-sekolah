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
}
