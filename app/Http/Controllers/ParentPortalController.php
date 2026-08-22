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
        
        $students = collect();
        if ($user->role === 'guardian') {
            $guardian = $user->guardian;
            if ($guardian) {
                $students = \App\Models\Student::with(['bills.billType', 'payments.bill.billType'])->where('guardian_id', $guardian->id)->get();
            }
        } else if ($user->role === 'siswa') {
            $students = \App\Models\Student::with(['bills.billType', 'payments.bill.billType'])->where('nis', $user->username)->get();
        }

        $notifications = [];
        $idCounter = 1;

        \Carbon\Carbon::setLocale('id');

        foreach ($students as $student) {
            foreach ($student->bills as $bill) {
                if ($bill->status === 'UNPAID') {
                    $dueDate = \Carbon\Carbon::parse($bill->due_date);
                    $now = \Carbon\Carbon::now();
                    
                    if ($dueDate->isPast() && !$dueDate->isToday()) {
                        // JATUH TEMPO
                        $notifications[] = [
                            'id' => $idCounter++,
                            'type' => 'TAGIHAN JATUH TEMPO',
                            'typeColor' => 'text-error',
                            'icon' => 'error',
                            'iconBg' => 'bg-error-container',
                            'iconColor' => 'text-on-error-container',
                            'time' => $dueDate->diffForHumans(),
                            'title' => $bill->billType->name . ' ' . $bill->period,
                            'desc' => "Tagihan " . $bill->billType->name . " ananda " . $student->name . " sebesar Rp " . number_format($bill->amount, 0, ',', '.') . " telah jatuh tempo pada " . $dueDate->translatedFormat('d F Y') . ". Harap segera melakukan pembayaran.",
                            'actionText' => 'Bayar Sekarang',
                            'actionIcon' => 'arrow_forward',
                            'actionUrl' => route('parent.pay.method', $bill->id),
                            'unread' => true,
                            'filterType' => 'Tagihan',
                            'created_at' => $dueDate->timestamp
                        ];
                    } else if ($now->diffInDays($dueDate, false) >= 0 && $now->diffInDays($dueDate, false) <= 7) {
                        // PENGINGAT
                        $notifications[] = [
                            'id' => $idCounter++,
                            'type' => 'PENGINGAT TAGIHAN',
                            'typeColor' => 'text-secondary',
                            'icon' => 'warning',
                            'iconBg' => 'bg-secondary-container',
                            'iconColor' => 'text-on-secondary-container',
                            'time' => 'Jatuh tempo dalam ' . ($now->diffInDays($dueDate) == 0 ? 'hari ini' : $now->diffInDays($dueDate) . ' hari'),
                            'title' => $bill->billType->name . ' ' . $bill->period,
                            'desc' => "Mengingatkan kembali untuk pembayaran " . $bill->billType->name . " ananda " . $student->name . " sebesar Rp " . number_format($bill->amount, 0, ',', '.') . " yang akan jatuh tempo pada " . $dueDate->translatedFormat('d F Y') . ".",
                            'actionText' => 'Bayar Sekarang',
                            'actionIcon' => 'arrow_forward',
                            'actionUrl' => route('parent.pay.method', $bill->id),
                            'unread' => true,
                            'filterType' => 'Tagihan',
                            'created_at' => \Carbon\Carbon::now()->subMinutes(rand(1, 60))->timestamp
                        ];
                    }
                }
            }
            
            // Payments
            foreach ($student->payments as $payment) {
                if ($payment->status === 'SUCCESS') {
                    $paidAt = \Carbon\Carbon::parse($payment->paid_at);
                    if ($paidAt->diffInDays(\Carbon\Carbon::now()) <= 30) {
                        $notifications[] = [
                            'id' => $idCounter++,
                            'type' => 'PEMBAYARAN BERHASIL',
                            'typeColor' => 'text-primary',
                            'icon' => 'check_circle',
                            'iconBg' => 'bg-primary-container',
                            'iconColor' => 'text-on-primary-container',
                            'time' => $paidAt->diffForHumans(),
                            'title' => 'Terima Kasih, ' . $payment->bill->billType->name . ' Lunas',
                            'desc' => "Pembayaran " . $payment->bill->billType->name . " " . $payment->bill->period . " sebesar Rp " . number_format($payment->amount, 0, ',', '.') . " telah berhasil diverifikasi. Jazakumullah khairan.",
                            'actionText' => 'Lihat Kuitansi',
                            'actionIcon' => 'receipt',
                            'unread' => false,
                            'filterType' => 'Pembayaran',
                            'opacityClass' => 'opacity-80',
                            'created_at' => $paidAt->timestamp
                        ];
                    }
                }
            }
        }

        // Add a static announcement
        $notifications[] = [
            'id' => $idCounter++,
            'type' => 'PENGUMUMAN SEKOLAH',
            'typeColor' => 'text-tertiary',
            'icon' => 'campaign',
            'iconBg' => 'bg-tertiary-fixed',
            'iconColor' => 'text-on-tertiary-fixed',
            'time' => 'Baru-baru ini',
            'title' => 'Selamat Datang di Portal Ponpes DKC',
            'desc' => "Assalamu'alaikum. Selamat datang di portal siswa dan wali murid. Seluruh informasi tagihan dan riwayat pembayaran dapat diakses melalui portal ini.",
            'unread' => false,
            'filterType' => 'Pengumuman',
            'opacityClass' => 'opacity-80',
            'patternBg' => true,
            'created_at' => \Carbon\Carbon::now()->subDays(10)->timestamp
        ];

        // Sort descending by created_at
        usort($notifications, function($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });

        return Inertia::render('Parent/Notifications', ['serverNotifications' => $notifications]);
    }

    public function bills() {
        $user = auth()->user();
        $students = collect();
        if ($user->role === 'guardian') {
            $guardian = $user->guardian;
            if (!$guardian) abort(403, 'Profil wali tidak ditemukan.');
            $students = Student::with(['bills' => function ($q) {
                $q->where('status', '!=', 'PAID')->with('billType');
            }])->where('guardian_id', $guardian->id)->get();
        } else if ($user->role === 'siswa') {
            $students = Student::with(['bills' => function ($q) {
                $q->where('status', '!=', 'PAID')->with('billType');
            }])->where('nis', $user->username)->get();
        } else {
            abort(403, 'Akses ditolak.');
        }

        return Inertia::render('Parent/Bills', ['students' => $students]);
    }

    public function history() {
        $user = auth()->user();
        $students = collect();
        if ($user->role === 'guardian') {
            $guardian = $user->guardian;
            if (!$guardian) abort(403, 'Profil wali tidak ditemukan.');
            $students = Student::with(['bills' => function ($q) {
                $q->where('status', 'PAID')->with(['billType', 'academicYear']);
            }])->where('guardian_id', $guardian->id)->get();
        } else if ($user->role === 'siswa') {
            $students = Student::with(['bills' => function ($q) {
                $q->where('status', 'PAID')->with(['billType', 'academicYear']);
            }])->where('nis', $user->username)->get();
        } else {
            abort(403, 'Akses ditolak.');
        }

        $academicYears = \App\Models\AcademicYear::all();

        return Inertia::render('Parent/History', ['students' => $students, 'academicYears' => $academicYears]);
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