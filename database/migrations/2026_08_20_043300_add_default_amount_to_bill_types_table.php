<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bill_types', function (Blueprint $table) {
            $table->decimal('default_amount', 15, 2)->default(0)->after('name');
        });
    }

    public function down()
    {
        Schema::table('bill_types', function (Blueprint $table) {
            $table->dropColumn('default_amount');
        });
    }
};
