<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Bill;

class ArrearController extends Controller {
    public function index() {
        $arrears = Bill::with(['student.studentClass', 'billType'])
            ->where('status', 'UNPAID')
            ->where('due_date', '<', now())
            ->paginate(15);
        $total = Bill::where('status', 'UNPAID')->sum('amount');
        $count = Bill::where('status', 'UNPAID')->distinct('student_id')->count('student_id');
        return Inertia::render('Arrears/Index', ['arrears' => $arrears, 'total' => $total, 'count' => $count]);
    }
}