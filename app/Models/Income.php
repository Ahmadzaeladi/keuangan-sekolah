<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Income extends Model
{
    protected $guarded = ['id'];

    //

    public function category() { return $this->belongsTo(IncomeCategory::class, 'income_category_id'); }
}
