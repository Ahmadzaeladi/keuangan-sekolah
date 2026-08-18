import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats, transactions, chartData }: any) {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="max-w-container-max mx-auto w-full">
                <div className="flex justify-between items-end mb-6 mt-4 md:mt-8">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Dashboard Keuangan</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">Ringkasan aktivitas finansial sekolah.</p>
                    </div>
                    <div className="flex gap-3">
                        <a href="/payments" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-lg flex items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                            <span className="material-symbols-outlined mr-2 text-[20px]">point_of_sale</span>
                            Buka Kasir
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-primary text-on-primary rounded-xl p-6 relative overflow-hidden shadow-md">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <span className="material-symbols-outlined text-[100px] -mr-4 -mt-4">account_balance_wallet</span>
                        </div>
                        <div className="relative z-10">
                            <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">Total Saldo Kas</span>
                            <div className="font-display-sm text-display-sm mt-2 mb-4">Rp {Number(stats?.saldo || 0).toLocaleString('id-ID')}</div>
                            <div className="font-body-sm text-body-sm text-primary-fixed-dim flex items-center">
                                <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> Termasuk semua bank
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:soft-shadow transition-shadow arabesque-pattern">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Kas Masuk</span>
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                            </div>
                        </div>
                        <div className="font-headline-md text-headline-md text-on-surface mb-1">Rp {Number(stats?.pemasukan || 0).toLocaleString('id-ID')}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Bulan ini</div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:soft-shadow transition-shadow arabesque-pattern">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Kas Keluar</span>
                            <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
                                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                            </div>
                        </div>
                        <div className="font-headline-md text-headline-md text-on-surface mb-1">Rp {Number(stats?.pengeluaran || 0).toLocaleString('id-ID')}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Bulan ini</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Arus Kas Bulanan</h3>
                        <div className="h-64 pt-4 border-b border-outline-variant w-full min-w-0">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bfc9c3" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#404944'}} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val/1000000}M`} tick={{fill: '#404944'}} />
                                    <Tooltip 
                                        formatter={(value) => `Rp ${(value as number).toLocaleString('id-ID')}`}
                                        cursor={{fill: '#f5f4ef'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                    />
                                    <Bar dataKey="pemasukan" fill="#064e3b" radius={[4, 4, 0, 0]} name="Pemasukan" />
                                    <Bar dataKey="pengeluaran" fill="#fed65b" radius={[4, 4, 0, 0]} name="Pengeluaran" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-outline-variant bg-surface-bright flex gap-4 items-center justify-between">
                            <h3 className="font-headline-md text-on-surface">Transaksi Terbaru</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant text-tertiary-container text-xs font-semibold tracking-wider uppercase">
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {transactions?.map((t: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-surface transition-colors">
                                            <td className="px-6 py-4 text-on-surface-variant text-sm">
                                                {new Date(t.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-sm">{t.desc}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    t.type === 'in' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-error'
                                                }`}>
                                                    {t.cat}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold text-sm ${
                                                t.type === 'in' ? 'text-primary' : 'text-error'
                                            }`}>
                                                {t.type === 'in' ? '+' : '-'} Rp {Number(t.amount || 0).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!transactions || transactions.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                                                Belum ada transaksi.
                                            </td>
                                        </tr>
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
