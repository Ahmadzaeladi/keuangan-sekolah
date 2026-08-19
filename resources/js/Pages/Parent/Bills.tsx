import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function Bills({ students }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    
    // Calculate total overdue across all students
    let totalOverdue = 0;
    let totalPaid = 0;
    let totalBilled = 0;
    
    const allUnpaid: any[] = [];
    const allPaid: any[] = [];

    students.forEach((s: any) => {
        s.bills.forEach((b: any) => {
            b.studentName = s.name;
            totalBilled += Number(b.amount);
            if (b.status === 'PAID') {
                totalPaid += Number(b.amount);
                allPaid.push(b);
            } else {
                totalOverdue += Number(b.amount); // Simplification: all unpaid are "Tertunggak" for this view
                allUnpaid.push(b);
            }
        });
    });

    const progress = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;

    return (
        <ParentLayout title="Rincian Tagihan">
            <Head title="Rincian Tagihan & Riwayat" />
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-6 pb-8">
                {/* Filter Section */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 p-4 shadow-sm flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tahun Ajaran</span>
                        <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">2023 - 2024</span>
                    </div>
                    <button className="bg-primary-container text-on-primary text-body-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        Ubah
                    </button>
                </section>

                {/* Summary Card */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden bg-[url('data:image/svg+xml;utf8,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 0L100 50L50 100L0 50L50 0Z\' fill=\'%23064E3B\' fill-opacity=\'0.03\'/%3E%3C/svg%3E')] bg-[length:50px_50px]">
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-body-sm text-body-sm text-on-surface-variant">Total Tagihan Tertunggak</h2>
                                <p className="font-numeric-lg text-numeric-lg text-error">{formatRp(totalOverdue)}</p>
                            </div>
                            {totalOverdue > 0 && (
                                <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                                    Perhatian
                                </span>
                            )}
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-body-sm text-on-surface-variant">
                            <span>Terbayar: {formatRp(totalPaid)}</span>
                            <span>Total: {formatRp(totalBilled)}</span>
                        </div>
                    </div>
                </section>

                {/* Unpaid Bills */}
                {allUnpaid.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/30">Belum Lunas</h3>
                        {allUnpaid.map(b => (
                            <div key={b.id} className="bg-surface rounded-xl border border-outline-variant/30 p-4 shadow-sm hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] transition-shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                                        </div>
                                        <div>
                                            <h4 className="font-body-md text-body-md font-semibold text-on-surface">{b.bill_type.name} {b.period}</h4>
                                            <p className="font-body-sm text-body-sm text-error">Jatuh Tempo: {new Date(b.due_date).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded-full">Belum Lunas</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                                    <span className="font-body-lg text-body-lg font-bold text-on-surface">{formatRp(b.amount)}</span>
                                    <Link href={route('parent.pay.method', b.id)} className="text-primary font-label-md text-label-md uppercase tracking-wider hover:opacity-80">
                                        Bayar Sekarang
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Paid Bills */}
                {allPaid.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/30 mt-6">Riwayat Lunas</h3>
                        {allPaid.map(b => (
                            <div key={b.id} className="bg-surface rounded-xl border border-outline-variant/30 p-4 shadow-sm hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] transition-shadow opacity-75">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center">
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </div>
                                        <div>
                                            <h4 className="font-body-md text-body-md font-semibold text-on-surface">{b.bill_type.name} {b.period}</h4>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant">{b.studentName}</p>
                                        </div>
                                    </div>
                                    <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-1 rounded-full">Lunas</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                                    <span className="font-body-lg text-body-lg font-bold text-on-surface line-through text-on-surface-variant">{formatRp(b.amount)}</span>
                                    <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:opacity-80">
                                        <span className="material-symbols-outlined text-[16px]">download</span> Kuitansi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </ParentLayout>
    );
}