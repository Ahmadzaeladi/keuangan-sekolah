<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\ArrearController;
use App\Http\Controllers\ParentPortalController;
use App\Http\Controllers\ReportController;
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
    Route::get('/students/promotion', [StudentController::class, 'promotion'])->name('students.promotion');
    Route::post('/students/promote', [StudentController::class, 'promote'])->name('students.promote');
    Route::get('/students/export', [StudentController::class, 'export'])->name('students.export');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');

    // Bills
    Route::get('/bills', [BillController::class, 'index'])->name('bills.index');
    Route::post('/bills/bulk', [BillController::class, 'bulkStore'])->name('bills.bulkStore');

    // Payments
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('/api/students/search', [PaymentController::class, 'searchStudent']);
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');

    // Finance
    Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');
    Route::post('/finance/income', [FinanceController::class, 'storeIncome'])->name('finance.income.store');
    Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');
    Route::post('/finance/expenses', [FinanceController::class, 'storeExpense'])->name('finance.expenses.store');
    Route::get('/finance/cash', [FinanceController::class, 'cash'])->name('finance.cash');
    Route::get('/finance/cash/export', [FinanceController::class, 'exportCash'])->name('finance.cash.export');

    // Arrears
    Route::get('/arrears', [ArrearController::class, 'index'])->name('arrears.index');

    // Reports
    Route::get('/reports/finance', [ReportController::class, 'finance'])->name('reports.finance');
    Route::get('/reports/payments', [ReportController::class, 'payments'])->name('reports.payments');

    // Parent Portal
    Route::get('/parent/dashboard', [ParentPortalController::class, 'dashboard'])->name('parent.dashboard');
    Route::post('/parent/pay/{bill}', [ParentPortalController::class, 'pay'])->name('parent.pay');
});

require __DIR__.'/auth.php';