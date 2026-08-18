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
        $guardian = $user->guardian;
        if (!$guardian) {
            abort(403, 'Bukan akun orang tua.');
        }

        $students = Student::with(['studentClass', 'bills.billType'])->where('guardian_id', $guardian->id)->get();
        return Inertia::render('Parent/Dashboard', ['students' => $students]);
    }

    public function pay(Bill $bill, Request $request) {
        $validated = $request->validate([
            'method' => 'required|in:TRANSFER,QRIS'
        ]);

        DB::transaction(function() use ($bill, $validated) {
            Payment::create([
                'bill_id' => $bill->id,
                'student_id' => $bill->student_id,
                'payment_number' => 'PAY-' . date('Ymd') . '-' . rand(100, 999),
                'amount' => $bill->amount, // full payment sim
                'payment_method' => $validated['method'],
                'paid_at' => now(),
                'status' => 'SUCCESS',
                'notes' => 'Pembayaran Orang Tua'
            ]);
            $bill->update(['status' => 'PAID']);
        });

        return back()->with('success', 'Pembayaran berhasil.');
    }
}