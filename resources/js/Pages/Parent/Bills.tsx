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
            totalOverdue += Number(b.amount); // Simplification: all unpaid are "Tertunggak" for this view
            allUnpaid.push(b);
        });
    });

    const progress = 0;

    return (
        <ParentLayout title="Rincian Tagihan">
            <Head title="Rincian Tagihan" />
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-6 pb-8">
                {/* Filter Section */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 p-4 shadow-sm flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tahun Ajaran</span>
                        <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                            {new Date().getMonth() >= 6 ? `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}` : `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`}
                        </span>
                    </div>
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
                    </div>
                </section>

                {/* Unpaid Bills */}
                {allUnpaid.length > 0 ? (
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
                                            <div className="font-body-sm text-body-sm text-error">
                                                Jatuh Tempo: <br className="sm:hidden" /> 
                                                <span className="hidden sm:inline"> </span>
                                                {new Date(b.due_date).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">Belum Lunas</span>
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
                ) : (
                    <div className="text-center py-8 text-on-surface-variant">
                        Tidak ada tagihan yang belum lunas.
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}