<?php
$controllersDir = __DIR__ . '/app/Http/Controllers';

// DashboardController
$dashboardController = <<<EOT
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
        \$saldo = CashAccount::sum('balance');
        \$pemasukan = Income::sum('amount');
        \$pengeluaran = Expense::sum('amount');
        \$tunggakan = Bill::where('status', 'UNPAID')->sum('amount');
        \$siswaBelumBayar = Bill::where('status', 'UNPAID')->distinct('student_id')->count('student_id');

        \$transactions = collect();
        foreach (Income::with('category')->latest()->take(5)->get() as \$i) {
            \$transactions->push(['date' => \$i->date, 'desc' => \$i->description, 'amount' => \$i->amount, 'type' => 'in', 'cat' => \$i->category->name]);
        }
        foreach (Expense::with('category')->latest()->take(5)->get() as \$e) {
            \$transactions->push(['date' => \$e->date, 'desc' => \$e->description, 'amount' => \$e->amount, 'type' => 'out', 'cat' => \$e->category->name]);
        }
        \$transactions = \$transactions->sortByDesc('date')->take(5)->values();

        return Inertia::render('Dashboard/Index', [
            'stats' => compact('saldo', 'pemasukan', 'pengeluaran', 'tunggakan', 'siswaBelumBayar'),
            'transactions' => \$transactions
        ]);
    }
}
EOT;
file_put_contents($controllersDir . '/DashboardController.php', $dashboardController);

// StudentController
$studentController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller {
    public function index() {
        \$students = Student::with(['studentClass', 'guardian', 'bills' => function(\$q){
            \$q->where('status', 'UNPAID');
        }])->paginate(10);

        return Inertia::render('Students/Index', ['students' => \$students]);
    }

    public function show(Student \$student) {
        \$student->load(['studentClass', 'guardian', 'bills.billType', 'payments']);
        
        \$totalTagihan = \$student->bills->sum('amount');
        \$sudahDibayar = \$student->payments->where('status', 'SUCCESS')->sum('amount');
        \$sisaTagihan = \$totalTagihan - \$sudahDibayar;

        return Inertia::render('Students/Show', [
            'student' => \$student,
            'summary' => compact('totalTagihan', 'sudahDibayar', 'sisaTagihan')
        ]);
    }
}
EOT;
file_put_contents($controllersDir . '/StudentController.php', $studentController);

// BillController
$billController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Bill;

class BillController extends Controller {
    public function index() {
        \$bills = Bill::with(['student.studentClass', 'billType', 'academicYear'])->latest()->paginate(15);
        return Inertia::render('Bills/Index', ['bills' => \$bills]);
    }
}
EOT;
file_put_contents($controllersDir . '/BillController.php', $billController);

// PaymentController
$paymentController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Bill;
use App\Models\CashAccount;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller {
    public function index() {
        \$payments = Payment::with(['student', 'bill.billType'])->latest()->paginate(15);
        return Inertia::render('Payments/Index', ['payments' => \$payments]);
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
file_put_contents($controllersDir . '/PaymentController.php', $paymentController);

// FinanceController
$financeController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Income;
use App\Models\Expense;
use App\Models\CashAccount;

class FinanceController extends Controller {
    public function income() {
        \$incomes = Income::with('category')->latest()->paginate(15);
        \$total = Income::sum('amount');
        return Inertia::render('Finance/Income', ['incomes' => \$incomes, 'total' => \$total]);
    }

    public function expenses() {
        \$expenses = Expense::with('category')->latest()->paginate(15);
        \$total = Expense::sum('amount');
        return Inertia::render('Finance/Expenses', ['expenses' => \$expenses, 'total' => \$total]);
    }

    public function cash() {
        \$accounts = CashAccount::all();
        \$total = \$accounts->sum('balance');
        return Inertia::render('Finance/Cash', ['accounts' => \$accounts, 'total' => \$total]);
    }
}
EOT;
file_put_contents($controllersDir . '/FinanceController.php', $financeController);

// ArrearController
$arrearController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Bill;

class ArrearController extends Controller {
    public function index() {
        \$arrears = Bill::with(['student.studentClass', 'billType'])
            ->where('status', 'UNPAID')
            ->where('due_date', '<', now())
            ->paginate(15);
        \$total = Bill::where('status', 'UNPAID')->sum('amount');
        \$count = Bill::where('status', 'UNPAID')->distinct('student_id')->count('student_id');
        return Inertia::render('Arrears/Index', ['arrears' => \$arrears, 'total' => \$total, 'count' => \$count]);
    }
}
EOT;
file_put_contents($controllersDir . '/ArrearController.php', $arrearController);

// ParentPortalController
$parentController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class ParentPortalController extends Controller {
    public function dashboard() {
        \$user = auth()->user();
        \$guardian = \$user->guardian;
        if (!\$guardian) {
            abort(403, 'Bukan akun orang tua.');
        }

        \$students = Student::with(['studentClass', 'bills.billType'])->where('guardian_id', \$guardian->id)->get();
        return Inertia::render('Parent/Dashboard', ['students' => \$students]);
    }

    public function pay(Bill \$bill, Request \$request) {
        \$validated = \$request->validate([
            'method' => 'required|in:TRANSFER,QRIS'
        ]);

        DB::transaction(function() use (\$bill, \$validated) {
            Payment::create([
                'bill_id' => \$bill->id,
                'student_id' => \$bill->student_id,
                'payment_number' => 'PAY-' . date('Ymd') . '-' . rand(100, 999),
                'amount' => \$bill->amount, // full payment sim
                'payment_method' => \$validated['method'],
                'paid_at' => now(),
                'status' => 'SUCCESS',
                'notes' => 'Pembayaran Orang Tua'
            ]);
            \$bill->update(['status' => 'PAID']);
        });

        return back()->with('success', 'Pembayaran berhasil.');
    }
}
EOT;
file_put_contents($controllersDir . '/ParentPortalController.php', $parentController);

// Update routes/web.php
$routes = <<<EOT
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\ArrearController;
use App\Http\Controllers\ParentPortalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Students
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');

    // Bills
    Route::get('/bills', [BillController::class, 'index'])->name('bills.index');

    // Payments
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');

    // Finance
    Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');
    Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');
    Route::get('/finance/cash', [FinanceController::class, 'cash'])->name('finance.cash');

    // Arrears
    Route::get('/arrears', [ArrearController::class, 'index'])->name('arrears.index');

    // Parent Portal
    Route::get('/parent/dashboard', [ParentPortalController::class, 'dashboard'])->name('parent.dashboard');
    Route::post('/parent/pay/{bill}', [ParentPortalController::class, 'pay'])->name('parent.pay');
});

require __DIR__.'/auth.php';
EOT;
file_put_contents(__DIR__ . '/routes/web.php', $routes);

echo "Controllers and routes generated.\n";
