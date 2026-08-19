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
        $user = auth()->user();
        $students = collect();
        if ($user->role === 'guardian') {
            $guardian = $user->guardian;
            if (!$guardian) abort(403, 'Profil wali tidak ditemukan.');
            $students = Student::with(['studentClass', 'bills.billType'])->where('guardian_id', $guardian->id)->get();
        } else if ($user->role === 'siswa') {
            $students = Student::with(['studentClass', 'bills.billType'])->where('nis', $user->username)->get();
        } else {
            abort(403, 'Akses ditolak.');
        }

        return Inertia::render('Parent/Dashboard', ['students' => $students]);
    }

    public function notifications() {
        $user = auth()->user();
        if (!in_array($user->role, ['guardian', 'siswa'])) abort(403);
        
        return Inertia::render('Parent/Notifications');
    }

    public function bills() {
        $user = auth()->user();
        $students = collect();
        if ($user->role === 'guardian') {
            $guardian = $user->guardian;
            if (!$guardian) abort(403, 'Profil wali tidak ditemukan.');
            $students = Student::with(['bills.billType'])->where('guardian_id', $guardian->id)->get();
        } else if ($user->role === 'siswa') {
            $students = Student::with(['bills.billType'])->where('nis', $user->username)->get();
        } else {
            abort(403, 'Akses ditolak.');
        }

        return Inertia::render('Parent/Bills', ['students' => $students]);
    }

    public function profile() {
        return Inertia::render('Parent/Profile');
    }

    public function paymentMethod(Bill $bill) {
        $bill->load('student', 'billType');
        return Inertia::render('Parent/PaymentMethod', ['bill' => $bill]);
    }

    public function paymentInstruction(Request $request, Bill $bill) {
        $validated = $request->validate([
            'method' => 'required|string'
        ]);

        $bill->load('student', 'billType');
        return Inertia::render('Parent/PaymentInstruction', [
            'bill' => $bill,
            'method' => $validated['method']
        ]);
    }

    public function processPayment(Request $request, Bill $bill) {
        $validated = $request->validate([
            'method' => 'required|string'
        ]);

        $payment = null;
        DB::transaction(function() use ($bill, $validated, &$payment) {
            $payment = Payment::create([
                'bill_id' => $bill->id,
                'student_id' => $bill->student_id,
                'payment_number' => 'PAY-' . date('Ymd') . '-' . rand(100, 999),
                'amount' => $bill->amount,
                'payment_method' => strtoupper($validated['method']),
                'paid_at' => now(),
                'status' => 'SUCCESS',
                'notes' => 'Pembayaran Orang Tua Online'
            ]);
            $bill->update(['status' => 'PAID']);
        });

        return redirect()->route('parent.payment.success', $payment->id);
    }

    public function paymentSuccess(Payment $payment) {
        $payment->load('bill.billType', 'student');
        return Inertia::render('Parent/PaymentSuccess', ['payment' => $payment]);
    }
}