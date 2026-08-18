<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expense extends Model
{
    protected $guarded = ['id'];

    //

    public function category() { return $this->belongsTo(ExpenseCategory::class, 'expense_category_id'); }
}
