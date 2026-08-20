<?php

namespace App\Http\Controllers;

use App\Models\BillType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillTypeController extends Controller
{
    public function index()
    {
        $billTypes = BillType::latest()->get();
        return Inertia::render('Bills/Types', [
            'billTypes' => $billTypes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:bill_types,name',
            'default_amount' => 'required|numeric|min:0',
        ]);

        BillType::create($validated);

        return back()->with('success', 'Jenis tagihan berhasil ditambahkan.');
    }

    public function update(Request $request, BillType $billType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:bill_types,name,' . $billType->id,
            'default_amount' => 'required|numeric|min:0',
        ]);

        $billType->update($validated);

        return back()->with('success', 'Jenis tagihan berhasil diperbarui.');
    }

    public function destroy(BillType $billType)
    {
        // Check if there are bills associated with this type
        if (\App\Models\Bill::where('bill_type_id', $billType->id)->exists()) {
            return back()->with('error', 'Tidak dapat menghapus jenis tagihan karena masih memiliki data tagihan.');
        }

        $billType->delete();

        return back()->with('success', 'Jenis tagihan berhasil dihapus.');
    }
}
