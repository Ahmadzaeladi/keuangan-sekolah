<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $guarded = ['id'];

    //

    public function studentClass() { return $this->belongsTo(StudentClass::class); }
    public function guardian() { return $this->belongsTo(Guardian::class); }
    public function bills() { return $this->hasMany(Bill::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}
