<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $guarded = ['id'];

    //

    public function bill() { return $this->belongsTo(Bill::class); }
    public function student() { return $this->belongsTo(Student::class); }
}
