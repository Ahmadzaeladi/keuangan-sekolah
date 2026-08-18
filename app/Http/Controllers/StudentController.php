<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller {
    public function index() {
        $students = Student::with(['studentClass', 'guardian', 'bills' => function($q){
            $q->where('status', 'UNPAID');
        }])->paginate(10);

        return Inertia::render('Students/Index', ['students' => $students]);
    }

        public function export() {
        $fileName = 'Data_Siswa_SIKOLA.csv';
        $students = \App\Models\Student::with(['studentClass', 'guardian.user'])->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Agama', 'Alamat', 'Nama Wali', 'No Telp Wali', 'Email Wali'];

        $callback = function() use($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($students as $s) {
                $row = [
                    $s->nis,
                    $s->nisn,
                    $s->name,
                    $s->studentClass ? $s->studentClass->name : '',
                    $s->gender,
                    $s->religion,
                    $s->address,
                    $s->guardian ? $s->guardian->name : '',
                    $s->guardian ? $s->guardian->phone : '',
                    $s->guardian && $s->guardian->user ? $s->guardian->user->email : '',
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function show(Student $student) {
        $student->load(['studentClass', 'guardian', 'bills.billType', 'payments']);
        
        $totalTagihan = $student->bills->sum('amount');
        $sudahDibayar = $student->payments->where('status', 'SUCCESS')->sum('amount');
        $sisaTagihan = $totalTagihan - $sudahDibayar;

        return Inertia::render('Students/Show', [
            'student' => $student,
            'summary' => compact('totalTagihan', 'sudahDibayar', 'sisaTagihan')
        ]);
    }
}