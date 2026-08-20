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
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::get('/students/promotion', [StudentController::class, 'promotion'])->name('students.promotion');
    Route::post('/students/promote', [StudentController::class, 'promote'])->name('students.promote');
    Route::get('/students/export', [StudentController::class, 'export'])->name('students.export');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    // Bills
    Route::get('/bills', [BillController::class, 'index'])->name('bills.index');
    Route::post('/bills/bulk', [BillController::class, 'bulkStore'])->name('bills.bulkStore');
    Route::delete('/bills/bulk', [BillController::class, 'bulkDestroy'])->name('bills.bulkDestroy');
    Route::delete('/bills/{bill}', [BillController::class, 'destroy'])->name('bills.destroy');

    // Bill Types
    Route::get('/bill-types', [\App\Http\Controllers\BillTypeController::class, 'index'])->name('bill-types.index');
    Route::post('/bill-types', [\App\Http\Controllers\BillTypeController::class, 'store'])->name('bill-types.store');
    Route::put('/bill-types/{billType}', [\App\Http\Controllers\BillTypeController::class, 'update'])->name('bill-types.update');
    Route::delete('/bill-types/{billType}', [\App\Http\Controllers\BillTypeController::class, 'destroy'])->name('bill-types.destroy');

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
    Route::get('/reports/finance/export', [ReportController::class, 'exportFinance'])->name('reports.finance.export');
    Route::get('/reports/payments', [ReportController::class, 'payments'])->name('reports.payments');
    Route::get('/reports/payments/export', [ReportController::class, 'exportPayments'])->name('reports.payments.export');

    // Parent Portal
    Route::get('/parent/dashboard', [ParentPortalController::class, 'dashboard'])->name('parent.dashboard');
    Route::get('/parent/notifications', [ParentPortalController::class, 'notifications'])->name('parent.notifications');
    Route::get('/parent/bills', [ParentPortalController::class, 'bills'])->name('parent.bills');
    Route::get('/parent/history', [ParentPortalController::class, 'history'])->name('parent.history');
    Route::get('/parent/profile', [ParentPortalController::class, 'profile'])->name('parent.profile');
    
    Route::get('/parent/pay/{bill}', [ParentPortalController::class, 'paymentMethod'])->name('parent.pay.method');
    Route::post('/parent/pay/{bill}/instruction', [ParentPortalController::class, 'paymentInstruction'])->name('parent.pay.instruction');
    Route::post('/parent/pay/{bill}/process', [ParentPortalController::class, 'processPayment'])->name('parent.pay.process');
    Route::get('/parent/payment-success/{payment}', [ParentPortalController::class, 'paymentSuccess'])->name('parent.payment.success');
});

require __DIR__.'/auth.php';