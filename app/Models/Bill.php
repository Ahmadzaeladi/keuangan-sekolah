<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    protected $guarded = ['id'];

    //

    public function student() { return $this->belongsTo(Student::class); }
    public function billType() { return $this->belongsTo(BillType::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}
