import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function PaymentSuccess({ payment }: any) {
    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <ParentLayout hideNav={true} title="Pembayaran Berhasil" backUrl={route('parent.dashboard')}>
            <Head title="Pembayaran Berhasil" />

            <div className="flex flex-col items-center relative overflow-hidden -mx-margin-mobile px-margin-mobile -mt-6 pt-12 pb-8 md:-mx-0 md:rounded-xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23064E3B\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none opacity-50"></div>
                
                <div className="w-24 h-24 bg-[#E6F4EA] rounded-full flex items-center justify-center mb-8 relative z-10 shadow-[0_4px_12px_rgba(6,78,59,0.05)]">
                    <span className="material-symbols-outlined text-[48px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                
                <div className="text-center mb-10 relative z-10">
                    <p className="font-label-md text-label-md text-outline mb-1 uppercase tracking-wider">Total Pembayaran</p>
                    <h2 className="font-numeric-lg text-numeric-lg text-on-surface">{formatRp(payment.amount)}</h2>
                </div>

                <div className="w-full bg-surface-container-lowest rounded-[16px] border border-outline-variant/30 p-gutter mb-8 relative z-10 shadow-[0_4px_12px_rgba(6,78,59,0.02)]">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant">Tanggal</span>
                            <span className="font-body-md text-body-md text-on-surface text-right">
                                {new Date(payment.paid_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>
                                <span className="text-sm text-outline">{new Date(payment.paid_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })} WIB</span>
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant">ID Transaksi</span>
                            <span className="font-body-sm text-body-sm text-on-surface font-mono bg-surface-container-low px-2 py-1 rounded">{payment.payment_number}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant">Metode Pembayaran</span>
                            <span className="font-body-md text-body-md text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
                                {payment.payment_method}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-b border-outline-variant/20 pb-4">
                            <span className="font-label-md text-label-md text-on-surface-variant">Siswa</span>
                            <span className="font-body-md text-body-md text-on-surface font-semibold text-primary">{payment.student.name}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-label-md text-label-md text-on-surface-variant">Tujuan</span>
                            <span className="font-body-md text-body-md text-on-surface font-semibold text-primary">{payment.bill.bill_type.name} {payment.bill.period}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4 relative z-10 mt-auto">
                    <button className="w-full py-3 px-6 bg-transparent border border-primary-container text-primary-container font-label-md text-label-md rounded-[8px] flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                        Download Kuitansi
                    </button>
                    <Link href={route('parent.dashboard')} className="w-full py-3 px-6 bg-primary-container text-on-primary font-label-md text-label-md rounded-[8px] flex items-center justify-center hover:bg-primary transition-colors shadow-[0_4px_12px_rgba(6,78,59,0.15)] active:scale-[0.98]">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </ParentLayout>
    );
}