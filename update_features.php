<?php

// Update web.php
$routes = file_get_contents(__DIR__ . '/routes/web.php');
$routes = str_replace(
    "Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');\n    Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');",
    "Route::get('/finance/income', [FinanceController::class, 'income'])->name('finance.income');\n    Route::post('/finance/income', [FinanceController::class, 'storeIncome'])->name('finance.income.store');\n    Route::get('/finance/expenses', [FinanceController::class, 'expenses'])->name('finance.expenses');\n    Route::post('/finance/expenses', [FinanceController::class, 'storeExpense'])->name('finance.expenses.store');",
    $routes
);
file_put_contents(__DIR__ . '/routes/web.php', $routes);

// Update BillController.php
$billController = <<<EOT
<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Bill;

class BillController extends Controller {
    public function index(Request \$request) {
        \$query = Bill::with(['student.studentClass', 'billType', 'academicYear'])->latest();
        
        if (\$search = \$request->query('search')) {
            \$query->whereHas('student', function(\$q) use (\$search) {
                \$q->where('nis', 'like', "%\$search%")
                  ->orWhere('name', 'like', "%\$search%");
            });
        }

        \$bills = \$query->paginate(15)->withQueryString();
        return Inertia::render('Bills/Index', [
            'bills' => \$bills,
            'filters' => \$request->only('search')
        ]);
    }
}
EOT;
file_put_contents(__DIR__ . '/app/Http/Controllers/BillController.php', $billController);

// Update Income.tsx
$incomeTsx = <<<EOT
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Income({ incomes, total, categories }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        income_category_id: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        source: '',
        description: ''
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post('/finance/income', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Pemasukan" />
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pemasukan</h1>
                    <p className="text-slate-500 mt-1">Total: <span className="font-bold text-green-600">{formatRp(total)}</span></p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">+ Tambah Pemasukan</button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Kategori</th><th className="px-6 py-3">Keterangan</th><th className="px-6 py-3">Sumber</th><th className="px-6 py-3 text-right">Nominal</th></tr>
                        </thead>
                        <tbody>
                            {incomes.data.map((i: any) => (
                                <tr key={i.id} className="border-b">
                                    <td className="px-6 py-4">{new Date(i.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">{i.category.name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{i.description}</td>
                                    <td className="px-6 py-4">{i.source}</td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatRp(i.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Catat Pemasukan</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                    <select required value={data.income_category_id} onChange={e => setData('income_category_id', e.target.value)} className="w-full rounded-md border-slate-300">
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal</label>
                                    <input required type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                                    <input required type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                                    <input required type="text" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Sumber (Opsional)</label>
                                    <input type="text" value={data.source} onChange={e => setData('source', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
EOT;
file_put_contents(__DIR__ . '/resources/js/Pages/Finance/Income.tsx', $incomeTsx);

// Update Expenses.tsx
$expenseTsx = <<<EOT
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';

export default function Expenses({ expenses, total, categories }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        expense_category_id: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        source: '',
        description: ''
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post('/finance/expenses', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Pengeluaran" />
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pengeluaran</h1>
                    <p className="text-slate-500 mt-1">Total: <span className="font-bold text-red-600">{formatRp(total)}</span></p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">+ Tambah Pengeluaran</button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Kategori</th><th className="px-6 py-3">Keterangan</th><th className="px-6 py-3 text-right">Nominal</th></tr>
                        </thead>
                        <tbody>
                            {expenses.data.map((e: any) => (
                                <tr key={e.id} className="border-b">
                                    <td className="px-6 py-4">{new Date(e.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">{e.category.name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{e.description}</td>
                                    <td className="px-6 py-4 text-right font-medium text-red-600">{formatRp(e.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Catat Pengeluaran</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                    <select required value={data.expense_category_id} onChange={e => setData('expense_category_id', e.target.value)} className="w-full rounded-md border-slate-300">
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal</label>
                                    <input required type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                                    <input required type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                                    <input required type="text" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full rounded-md border-slate-300" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
EOT;
file_put_contents(__DIR__ . '/resources/js/Pages/Finance/Expenses.tsx', $expenseTsx);

// Update Bills/Index.tsx to include Search by NIS/Name
$billsIndex = <<<EOT
import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function Index({ bills, filters }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const [selectedBill, setSelectedBill] = useState<any>(null);
    const [search, setSearch] = useState(filters?.search || '');

    const { data, setData, post, processing, reset } = useForm({
        bill_id: '',
        amount: '',
        payment_method: 'CASH', // Default to CASH for offline
        notes: 'Pembayaran Offline'
    });

    const openPayment = (bill: any) => {
        setSelectedBill(bill);
        setData({
            bill_id: bill.id,
            amount: bill.amount,
            payment_method: 'CASH',
            notes: 'Pembayaran Offline'
        });
    };

    const submitPayment = (e: any) => {
        e.preventDefault();
        post('/payments', {
            onSuccess: () => {
                setSelectedBill(null);
                reset();
            }
        });
    };

    const handleSearch = (e: any) => {
        e.preventDefault();
        router.get('/bills', { search }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title="Tagihan" />
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Pencarian & Pembayaran Tagihan</h1>
            
            <Card className="mb-6">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cari berdasarkan NIS / Nama Siswa</label>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Masukkan NIS atau Nama..." className="w-full rounded-md border-slate-300" />
                        </div>
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">Cari</button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="bg-slate-50 border-b">
                            <tr><th className="px-6 py-3">NIS</th><th className="px-6 py-3">Siswa</th><th className="px-6 py-3">Tagihan</th><th className="px-6 py-3">Periode</th><th className="px-6 py-3">Nominal</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Aksi</th></tr>
                        </thead>
                        <tbody>
                            {bills.data.map((b: any) => (
                                <tr key={b.id} className="border-b">
                                    <td className="px-6 py-4">{b.student.nis}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{b.student.name}</td>
                                    <td className="px-6 py-4">{b.bill_type.name}</td>
                                    <td className="px-6 py-4">{b.period}</td>
                                    <td className="px-6 py-4">{formatRp(b.amount)}</td>
                                    <td className="px-6 py-4"><Badge variant={b.status === 'PAID' ? 'success' : 'warning'}>{b.status}</Badge></td>
                                    <td className="px-6 py-4">
                                        {b.status !== 'PAID' && (
                                            <button onClick={() => openPayment(b)} className="text-blue-600 hover:underline font-medium">Bayar (Tunai)</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bills.data.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-8 text-center">Data tidak ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {selectedBill && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Catat Pembayaran Tunai</h2>
                            <form onSubmit={submitPayment}>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500">Siswa</p>
                                    <p className="font-medium">{selectedBill.student.nis} - {selectedBill.student.name}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-slate-500">Tagihan</p>
                                    <p className="font-medium">{selectedBill.bill_type.name} {selectedBill.period}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Pembayaran</label>
                                    <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Metode Pembayaran</label>
                                    <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="CASH">Tunai (Offline)</option>
                                        <option value="TRANSFER">Transfer Bank</option>
                                        <option value="QRIS">QRIS</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setSelectedBill(null)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Batal</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan Pembayaran</button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
EOT;
file_put_contents(__DIR__ . '/resources/js/Pages/Bills/Index.tsx', $billsIndex);

echo "Routes and UI updated for Finance & Bills Search.\n";
