import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function Dashboard({ students }: any) {
    // Collect all bills from students
    let totalUnpaid = 0;
    let overdueAmount = 0;
    const unpaidBills: any[] = [];
    let lastPayment: any = null; // Mock or fetch actual last payment

    students.forEach((s: any) => {
        s.bills.forEach((b: any) => {
            if (b.status !== 'PAID') {
                totalUnpaid += Number(b.amount);
                unpaidBills.push(b);
                if (new Date(b.due_date) < new Date()) {
                    overdueAmount += Number(b.amount);
                }
            }
        });
    });

    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <ParentLayout title="Amanah Finance">
            <Head title="Portal Orang Tua" />
            
            <div className="max-w-container-max mx-auto pt-4 md:pt-8 flex flex-col gap-6 md:gap-8 px-4 md:px-8">
                
                {/* Notification Banner */}
                {overdueAmount > 0 && (
                    <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3 relative overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20z\' fill=\'%23064E3B\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-10 mix-blend-multiply pointer-events-none"></div>
                        <span className="material-symbols-outlined shrink-0 mt-0.5">warning</span>
                        <div>
                            <p className="font-body-md text-body-md font-semibold mb-1">Pengingat Pembayaran</p>
                            <p className="font-body-sm text-body-sm">Harap segera selesaikan tunggakan pembayaran untuk memastikan kelancaran kegiatan belajar mengajar.</p>
                        </div>
                    </div>
                )}

                {/* Overdue Alert Card */}
                {overdueAmount > 0 && (
                    <section className="bg-surface-container-lowest rounded-[16px] border border-error/20 p-6 relative overflow-hidden group shadow-[0_4px_12px_rgba(186,26,26,0.05)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-error">error</span>
                                    <h2 className="font-label-md text-label-md text-error tracking-wider uppercase">Tunggakan Tagihan</h2>
                                </div>
                                <p className="font-numeric-lg text-numeric-lg text-on-background">{formatRp(overdueAmount)}</p>
                            </div>
                            <Link href={route('parent.bills')} className="w-full md:w-auto bg-[#ba1a1a] hover:bg-[#93000a] text-white font-label-md text-label-md py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                Bayar Sekarang
                            </Link>
                        </div>
                    </section>
                )}

                {/* Current Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-surface-container-lowest rounded-[16px] border border-outline-variant/30 p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] transition-shadow">
                        <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20z\' fill=\'%23064E3B\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-5 pointer-events-none"></div>
                        <div className="relative z-10">
                            <p className="font-label-md text-label-md text-on-surface-variant mb-2">TOTAL BELUM LUNAS</p>
                            <p className="font-numeric-lg text-numeric-lg text-primary">{formatRp(totalUnpaid)}</p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 bg-secondary-container/30 text-on-secondary-container px-3 py-1.5 rounded-full w-fit relative z-10">
                            <span className="material-symbols-outlined text-[16px]">pending_actions</span>
                            <span className="font-label-md text-label-md text-[10px]">{unpaidBills.length} Tagihan Aktif</span>
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest rounded-[16px] border border-outline-variant/30 p-6 flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] transition-shadow relative">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full pointer-events-none"></div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface-variant mb-2">STATUS AKUN</p>
                            <p className="font-headline-md text-headline-md text-on-background">Aktif</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{students.length} Siswa Terdaftar</p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full w-fit">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span className="font-label-md text-label-md text-[10px]">Portal Orang Tua</span>
                        </div>
                    </section>
                </div>

                {/* Detailed Breakdown List */}
                <section className="mb-8">
                    <h3 className="font-headline-md text-headline-md text-on-background mb-4 mt-2">Daftar Siswa</h3>
                    <div className="bg-surface-container-lowest rounded-[16px] border border-outline-variant/30 overflow-hidden shadow-sm">
                        {students.map((student: any, idx: number) => (
                            <div key={student.id} className={`flex items-center justify-between p-5 hover:bg-surface-container-low/50 transition-colors ${idx !== students.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-body-md text-body-md font-semibold text-on-background">{student.name}</p>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">NIS: {student.nis} • Kelas: {student.student_class?.name}</p>
                                    </div>
                                </div>
                                <Link href={route('parent.bills')} className="text-primary font-label-md hover:underline">
                                    Lihat Tagihan
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </ParentLayout>
    );
}