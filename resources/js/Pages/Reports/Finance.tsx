import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function FinanceReport({ incomes, expenses, currentMonth, currentYear }: any) {
    const totalIncome = incomes.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
    const totalExpense = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    const netTotal = totalIncome - totalExpense;

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return (
        <DashboardLayout>
            <Head title="Laporan Keuangan" />
            <div className="max-w-container-max mx-auto w-full">
                <div className="flex justify-between items-end mb-6 mt-4 md:mt-8">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Laporan Keuangan</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">Periode {months[currentMonth - 1]} {currentYear}</p>
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
                        <div className="overflow-x-auto">
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
                        <div className="overflow-x-auto">
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
