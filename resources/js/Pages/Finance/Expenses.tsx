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