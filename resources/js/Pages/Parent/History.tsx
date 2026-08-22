import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function History({ students, academicYears }: any) {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(() => {
        const active = academicYears?.find((ay: any) => ay.is_active);
        return active ? active.id.toString() : (academicYears?.[0]?.id.toString() || '');
    });
    const [selectedSemester, setSelectedSemester] = useState<string>('Semua');

    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    
    const allPaid: any[] = [];
    students.forEach((s: any) => {
        s.bills.forEach((b: any) => {
            b.studentName = s.name;
            allPaid.push(b);
        });
    });

    const ganjilMonths = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const genapMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

    const filteredPaid = allPaid.filter(b => {
        if (selectedAcademicYear && b.academic_year_id?.toString() !== selectedAcademicYear) return false;
        
        if (selectedSemester !== 'Semua') {
            const periodString = b.period || '';
            const isGanjil = ganjilMonths.some(m => periodString.includes(m));
            const isGenap = genapMonths.some(m => periodString.includes(m));
            
            if (selectedSemester === 'Ganjil' && !isGanjil) return false;
            if (selectedSemester === 'Genap' && !isGenap) return false;
        }
        return true;
    });

    let totalPaid = 0;
    filteredPaid.forEach(b => totalPaid += Number(b.amount));

    return (
        <ParentLayout title="Riwayat Pembayaran">
            <Head title="Riwayat Pembayaran" />
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-6 pb-8">
                {/* Filter Section */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col flex-1 w-full">
                        <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Tahun Ajaran</label>
                        <select 
                            value={selectedAcademicYear} 
                            onChange={e => setSelectedAcademicYear(e.target.value)}
                            className="bg-transparent border border-outline-variant rounded-lg p-2 text-primary font-semibold focus:ring-primary focus:border-primary"
                        >
                            <option value="">Semua Tahun</option>
                            {academicYears?.map((ay: any) => (
                                <option key={ay.id} value={ay.id}>{ay.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Semester</label>
                        <select 
                            value={selectedSemester} 
                            onChange={e => setSelectedSemester(e.target.value)}
                            className="bg-transparent border border-outline-variant rounded-lg p-2 text-primary font-semibold focus:ring-primary focus:border-primary"
                        >
                            <option value="Semua">Semua Semester</option>
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>
                    </div>
                </section>

                {/* Summary Card */}
                <section className="bg-surface rounded-xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden bg-[url('data:image/svg+xml;utf8,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 0L100 50L50 100L0 50L50 0Z\' fill=\'%23064E3B\' fill-opacity=\'0.03\'/%3E%3C/svg%3E')] bg-[length:50px_50px]">
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-body-sm text-body-sm text-on-surface-variant">Total Tagihan Terbayar</h2>
                                <p className="font-numeric-lg text-numeric-lg text-primary">{formatRp(totalPaid)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Paid Bills */}
                {filteredPaid.length > 0 ? (
                    <section className="space-y-4">
                        <h3 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/30 mt-6">Riwayat Lunas</h3>
                        {filteredPaid.map(b => (
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
                                    <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">Lunas</span>
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
                ) : (
                    <div className="text-center py-8 text-on-surface-variant">
                        Belum ada riwayat pembayaran yang sesuai filter.
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}