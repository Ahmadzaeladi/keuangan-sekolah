import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function FinanceReport({ incomes, expenses, currentMonth, currentYear }: any) {
    const totalIncome = incomes.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
    const totalExpense = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    const netTotal = totalIncome - totalExpense;

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const handleFilter = () => {
        router.get(route('reports.finance'), { month, year }, { preserveState: true });
    };

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <DashboardLayout>
            <Head title="Laporan Keuangan" />
            <div className="max-w-container-max mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 mt-4 md:mt-8">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Laporan Keuangan</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">Periode {months[currentMonth - 1]} {currentYear}</p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                        <select value={month} onChange={e => setMonth(e.target.value)} className="pl-4 pr-10 py-2 border rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center] bg-surface">
                            {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                        </select>
                        <select value={year} onChange={e => setYear(e.target.value)} className="pl-4 pr-10 py-2 border rounded-lg appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231b1c19%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px_12px] bg-[right_16px_center] bg-surface">
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button onClick={handleFilter} className="bg-primary text-white px-4 py-2 rounded-lg">Filter</button>
                        <a href={route('reports.finance.export', { month, year })} className="bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[20px]">download</span> Export
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Total Pemasukan</span>
                        <div className="font-display-sm text-primary mt-2">Rp {totalIncome.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                        <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Total Pengeluaran</span>
                        <div className="font-display-sm text-error mt-2">Rp {totalExpense.toLocaleString('id-ID')}</div>
                    </div>
                    <div className={`border rounded-xl p-6 shadow-sm ${netTotal >= 0 ? 'bg-primary text-on-primary border-primary' : 'bg-error-container text-error border-error'}`}>
                        <span className="font-label-md uppercase tracking-wider">Surplus / Defisit</span>
                        <div className="font-display-sm mt-2">{netTotal >= 0 ? '+' : '-'} Rp {Math.abs(netTotal).toLocaleString('id-ID')}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-outline-variant bg-surface-bright">
                            <h3 className="font-headline-md text-on-surface">Rincian Pemasukan</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Keterangan</th>
                                        <th className="px-4 py-3 text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {incomes.map((inc: any) => (
                                        <tr key={inc.id} className="hover:bg-surface-container-lowest">
                                            <td className="px-4 py-3 text-sm">{new Date(inc.date).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3 text-sm">{inc.description}</td>
                                            <td className="px-4 py-3 text-sm text-right text-primary font-bold">Rp {Number(inc.amount).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {incomes.length === 0 && (
                                        <tr><td colSpan={3} className="p-4 text-center text-on-surface-variant">Tidak ada pemasukan</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-outline-variant bg-surface-bright">
                            <h3 className="font-headline-md text-on-surface">Rincian Pengeluaran</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Keterangan</th>
                                        <th className="px-4 py-3 text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {expenses.map((exp: any) => (
                                        <tr key={exp.id} className="hover:bg-surface-container-lowest">
                                            <td className="px-4 py-3 text-sm">{new Date(exp.date).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3 text-sm">{exp.description}</td>
                                            <td className="px-4 py-3 text-sm text-right text-error font-bold">Rp {Number(exp.amount).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {expenses.length === 0 && (
                                        <tr><td colSpan={3} className="p-4 text-center text-on-surface-variant">Tidak ada pengeluaran</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
