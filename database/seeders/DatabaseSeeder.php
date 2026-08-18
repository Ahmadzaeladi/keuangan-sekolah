<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\School;
use App\Models\AcademicYear;
use App\Models\StudentClass;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\BillType;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\IncomeCategory;
use App\Models\Income;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\CashAccount;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $bendahara = User::create([
            'name' => 'Bendahara SIKOLA',
            'username' => '1234567890',
            'email' => 'bendahara@sikola.test',
            'password' => Hash::make('password'),
            'role' => 'bendahara'
        ]);

        $waliUser = User::create([
            'name' => 'Budi Santoso',
            'username' => '23241001',
            'email' => 'wali@sikola.test',
            'password' => Hash::make('password'),
            'role' => 'guardian'
        ]);

        // School
        $school = School::create([
            'name' => 'SMA Negeri 1 Kota Maju',
            'address' => 'Jl. Pendidikan No. 1'
        ]);

        // Academic Year
        $academicYear = AcademicYear::create([
            'school_id' => $school->id,
            'name' => '2026/2027',
            'is_active' => true
        ]);

        // Classes
        $classes = [];
        $classNames = ['X IPA 1', 'X IPS 1', 'XI IPA 1', 'XI IPS 1', 'XII IPA 1'];
        foreach ($classNames as $name) {
            $classes[] = StudentClass::create([
                'school_id' => $school->id,
                'name' => $name,
                'level' => (int) explode(' ', $name)[0] === 'X' ? 10 : ((int) explode(' ', $name)[0] === 'XI' ? 11 : 12)
            ]);
        }

        // Guardians
        $guardians = [];
        $guardians[] = Guardian::create([
            'user_id' => $waliUser->id,
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 10'
        ]);

        for ($i = 2; $i <= 10; $i++) {
            $u = User::create([
                'name' => 'Wali ' . $i,
                'username' => '2324100' . $i,
                'email' => 'wali'.$i.'@sikola.test',
                'password' => Hash::make('password'),
                'role' => 'guardian'
            ]);
            $guardians[] = Guardian::create([
                'user_id' => $u->id,
                'name' => 'Wali ' . $i,
                'phone' => '08123456789' . $i,
                'address' => 'Jl. Merdeka No. ' . (10 + $i)
            ]);
        }

        // Students
        $students = [];
        $studentNames = [
            'Ahmad Rizky', 'Siti Nurhaliza', 'Fajar Ramadhan', 'Nabila Putri',
            'Andi Pratama', 'Rina Maharani', 'Dimas Saputra', 'Aulia Rahma',
            'Bagas Arya', 'Citra Dewi', 'Deni Setiawan', 'Eka Putra',
            'Fira Amanda', 'Gilang Dirga', 'Hana Saraswati', 'Iqbal Ramadhan',
            'Jihan Fahira', 'Kevin Julio', 'Lesti Kejora', 'Muhammad Ilham'
        ];
        
        foreach ($studentNames as $index => $name) {
            $students[] = Student::create([
                'nis' => '2025' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'name' => $name,
                'student_class_id' => $classes[$index % 5]->id,
                'guardian_id' => $index === 0 ? $guardians[0]->id : $guardians[rand(1, 9)]->id, // Ahmad Rizky belongs to Budi
                'phone' => '0898765432' . $index,
                'status' => 'ACTIVE'
            ]);
        }

        // Bill Types
        $billTypesData = ['SPP', 'Uang Gedung', 'Uang Kegiatan', 'Seragam', 'Buku', 'Study Tour', 'Ujian', 'Wisuda'];
        $billTypes = [];
        foreach ($billTypesData as $bt) {
            $billTypes[] = BillType::create(['name' => $bt]);
        }

        // Cash Accounts
        CashAccount::create(['name' => 'Kas Tunai', 'balance' => 25500000]);
        CashAccount::create(['name' => 'Bank BCA', 'balance' => 50000000]);
        CashAccount::create(['name' => 'Bank BRI', 'balance' => 50000000]);

        // Bills & Payments
        foreach ($students as $student) {
            // Create SPP Bills for 1 Year (Juli - Juni)
            $months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
            foreach ($months as $i => $month) {
                $bill = Bill::create([
                    'student_id' => $student->id,
                    'bill_type_id' => $billTypes[0]->id, // SPP
                    'academic_year_id' => $academicYear->id,
                    'period' => $month . ' 2026',
                    'amount' => 500000,
                    'due_date' => Carbon::parse("2026-07-10")->addMonths($i),
                    'status' => 'UNPAID'
                ]);

                // Simulate payments mostly for past months (Juli, Agustus)
                $shouldPay = false;
                if ($student->name === 'Ahmad Rizky') {
                    $shouldPay = in_array($month, ['Juli', 'Agustus']);
                } else {
                    $shouldPay = in_array($month, ['Juli', 'Agustus']) && rand(0, 1);
                }

                if ($shouldPay) {
                    $bill->update(['status' => 'PAID']);
                    Payment::create([
                        'bill_id' => $bill->id,
                        'student_id' => $student->id,
                        'payment_number' => 'PAY-2026-' . $bill->id . '-' . rand(1000, 9999),
                        'amount' => 500000,
                        'payment_method' => ['CASH', 'TRANSFER', 'QRIS'][rand(0,2)],
                        'paid_at' => Carbon::now()->subDays(rand(1, 30)),
                        'status' => 'SUCCESS',
                        'notes' => 'Pembayaran awal'
                    ]);

                    $incomeCat = \App\Models\IncomeCategory::firstOrCreate(['name' => 'SPP & Tagihan Siswa']);
                    \App\Models\Income::create([
                        'income_category_id' => $incomeCat->id,
                        'date' => Carbon::now()->subDays(rand(1, 30))->format('Y-m-d'),
                        'description' => 'Pembayaran SPP - ' . $student->name,
                        'source' => 'Siswa',
                        'amount' => 500000,
                    ]);
                }
            }
        }

        // Incomes
        $incomeCats = ['Dana BOS', 'Sumbangan', 'Lainnya'];
        $iCats = [];
        foreach ($incomeCats as $ic) {
            $iCats[] = IncomeCategory::create(['name' => $ic]);
        }
        Income::create([
            'income_category_id' => $iCats[0]->id,
            'description' => 'Pencairan Dana BOS',
            'source' => 'Pemerintah',
            'amount' => 50000000,
            'date' => Carbon::now()->subDays(2)
        ]);

        // Expenses
        $expenseCats = ['Gaji', 'ATK', 'Listrik', 'Kegiatan', 'Pemeliharaan', 'Lainnya'];
        $eCats = [];
        foreach ($expenseCats as $ec) {
            $eCats[] = ExpenseCategory::create(['name' => $ec]);
        }
        
        $expenseData = [
            ['cat' => 0, 'amount' => 10000000, 'desc' => 'Gaji Guru Agustus'],
            ['cat' => 1, 'amount' => 2750000, 'desc' => 'Pembelian ATK'],
            ['cat' => 2, 'amount' => 1500000, 'desc' => 'Tagihan Listrik Agustus'],
            ['cat' => 3, 'amount' => 1200000, 'desc' => 'Biaya Kegiatan Lomba'],
            ['cat' => 4, 'amount' => 1000000, 'desc' => 'Perbaikan AC'],
            ['cat' => 5, 'amount' => 2250000, 'desc' => 'Lain-lain'],
        ];
        
        foreach ($expenseData as $ed) {
            Expense::create([
                'expense_category_id' => $eCats[$ed['cat']]->id,
                'description' => $ed['desc'],
                'amount' => $ed['amount'],
                'date' => Carbon::now()->subDays(rand(1, 10))
            ]);
        }
    }
}
