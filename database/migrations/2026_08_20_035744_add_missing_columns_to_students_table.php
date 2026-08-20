<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('nisn')->nullable()->unique()->after('nis');
            $table->enum('gender', ['L', 'P'])->nullable()->after('name');
            $table->string('religion')->nullable()->after('gender');
            $table->string('birth_place')->nullable()->after('religion');
            $table->date('birth_date')->nullable()->after('birth_place');
            $table->text('address')->nullable()->after('birth_date');
        });

        // Modify status enum to include GRADUATED
        DB::statement("ALTER TABLE students MODIFY COLUMN status ENUM('ACTIVE', 'INACTIVE', 'GRADUATED') DEFAULT 'ACTIVE'");
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'nisn',
                'gender',
                'religion',
                'birth_place',
                'birth_date',
                'address'
            ]);
        });

        // Revert status enum
        DB::statement("ALTER TABLE students MODIFY COLUMN status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'");
    }
};
