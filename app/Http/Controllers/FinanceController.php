<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\CashAccount;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller {
    public function income() {
        $incomes = Income::with('category')->latest()->paginate(15);
        $total = Income::sum('amount');
        $categories = IncomeCategory::all();
        return Inertia::render('Finance/Income', ['incomes' => $incomes, 'total' => $total, 'categories' => $categories]);
    }

        public function storeIncome(Request $request) {
        $validated = $request->validate([
            'income_category_id' => 'required|exists:income_categories,id',
            'amount' => 'required|numeric|min:1',
            'date' => 'required|date',
            'source' => 'nullable|string',
            'description' => 'required|string'
        ]);
        
        DB::transaction(function() use ($validated) {
            Income::create($validated);
            $cash = CashAccount::first();
            if($cash) $cash->increment('balance', $validated['amount']);
        });
        
        return back()->with('success', 'Pemasukan berhasil dicatat.');
    }

    public function expenses() {
        $expenses = Expense::with('category')->latest()->paginate(15);
        $total = Expense::sum('amount');
        $categories = ExpenseCategory::all();
        return Inertia::render('Finance/Expenses', ['expenses' => $expenses, 'total' => $total, 'categories' => $categories]);
    }

        public function storeExpense(Request $request) {
        $validated = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric|min:1',
            'date' => 'required|date',
            'source' => 'nullable|string',
            'description' => 'required|string'
        ]);
        
        DB::transaction(function() use ($validated) {
            Expense::create($validated);
            $cash = CashAccount::first();
            if($cash) $cash->decrement('balance', $validated['amount']);
        });
        
        return back()->with('success', 'Pengeluaran berhasil dicatat.');
    }

    public function exportCash() {
        $fileName = 'Buku_Kas_PONPES_DKC.xlsx';
        $incomes = Income::with('category')->get()->map(function($i) {
            $i->type = 'Pemasukan';
            return $i;
        });
        $expenses = Expense::with('category')->get()->map(function($e) {
            $e->type = 'Pengeluaran';
            return $e;
        });
        
        $merged = $incomes->concat($expenses)->sortByDesc('date');

        $data = [];
        $data[] = ['<b>Tanggal</b>', '<b>Jenis</b>', '<b>Kategori</b>', '<b>Keterangan</b>', '<b>Sumber</b>', '<b>Nominal (Rp)</b>'];
        
        foreach ($merged as $m) {
            $data[] = [
                date('d-m-Y', strtotime($m->date)), 
                $m->type, 
                $m->category ? $m->category->name : '', 
                $m->description, 
                $m->source, 
                $m->amount
            ];
        }

        $xlsx = \Shuchkin\SimpleXLSXGen::fromArray($data);
        return response((string) $xlsx)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"');
    }

    public function cash() {
        $accounts = CashAccount::all();
        $total = $accounts->sum('balance');
        return Inertia::render('Finance/Cash', ['accounts' => $accounts, 'total' => $total]);
    }
}