import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function PaymentInstruction({ bill, method }: any) {
    const { post, processing } = useForm({
        method: method
    });
    
    const [timeLeft, setTimeLeft] = useState(86399); // 24 hours in seconds
    const [toast, setToast] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    const vaNumber = "900 1234 5678 9012";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(vaNumber.replace(/\s/g, ''));
        setToast(true);
        setTimeout(() => setToast(false), 3000);
    };

    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const handleProcess = () => {
        post(route('parent.pay.process', bill.id));
    };

    return (
        <ParentLayout hideNav={true} title="Instruksi Bayar" backUrl={route('parent.pay.method', bill.id)}>
            <Head title="Instruksi Pembayaran" />

            <div className="bg-secondary-fixed/30 text-on-secondary-fixed flex items-center justify-between px-margin-mobile py-3 shadow-sm border-b border-secondary-fixed/50 -mx-margin-mobile -mt-6 mb-6 md:-mx-0 md:rounded-t-lg md:px-6">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-label-md text-label-md">Selesaikan sebelum</span>
                </div>
                <span className="font-numeric-lg text-[18px] font-bold tracking-wider">{hours}:{minutes}:{seconds}</span>
            </div>

            <section className="bg-surface-container-lowest rounded-[16px] border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden bg-[url('data:image/svg+xml;utf8,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 0L100 50L50 100L0 50L50 0ZM50 20L80 50L50 80L20 50L50 20Z\' fill=\'%23064E3B\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] bg-[length:150px]">
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/20 shadow-sm">
                        <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {['GOPAY', 'OVO', 'DANA'].includes(method) ? 'account_wallet' : 'account_balance'}
                        </span>
                    </div>
                    <div>
                        <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">{method}</h2>
                        <p className="font-body-md text-body-md font-medium text-on-surface">{method} {['GOPAY', 'OVO', 'DANA'].includes(method) ? 'Payment' : 'Virtual Account'}</p>
                    </div>
                </div>

                <div className="mb-5 relative z-10">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-2">NOMOR PEMBAYARAN</p>
                    <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-outline-variant/30 group hover:border-primary/30 transition-colors">
                        <span className="font-numeric-lg text-[22px] text-primary tracking-[0.1em] font-bold">{vaNumber}</span>
                        <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-primary bg-surface-container-lowest px-3 py-1.5 rounded shadow-sm border border-outline-variant/20 hover:bg-surface-container-low active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            <span className="font-label-md text-[10px]">Salin</span>
                        </button>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">TOTAL TAGIHAN</p>
                    <div className="flex items-baseline gap-1">
                        <span className="font-numeric-lg text-[28px] text-primary font-bold">{formatRp(bill.amount)}</span>
                    </div>
                </div>
            </section>

            <section className="mt-2">
                <h3 className="font-headline-lg-mobile text-[20px] font-semibold text-primary mb-4">Cara Pembayaran</h3>
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-5">
                    <ol className="list-decimal pl-5 space-y-2.5 marker:text-primary marker:font-medium">
                        <li>Buka aplikasi Bank atau E-Wallet pilihan Anda.</li>
                        <li>Pilih menu <strong>Pembayaran/Transfer</strong>.</li>
                        <li>Pilih <strong>Virtual Account / Billing</strong>.</li>
                        <li>Masukkan Nomor Pembayaran: <strong className="text-primary tracking-wide">{vaNumber}</strong>.</li>
                        <li>Layar akan menampilkan detail tagihan. Pastikan nama dan nominal sesuai.</li>
                        <li>Pilih <strong>Selesai / Konfirmasi</strong> untuk memproses.</li>
                    </ol>
                </div>
            </section>

            <div className="mt-6 mb-4">
                <button 
                    onClick={handleProcess} 
                    disabled={processing}
                    className="w-full bg-primary-container text-on-primary-container font-label-md text-[14px] py-4 rounded-[8px] shadow-[0_4px_12px_rgba(6,78,59,0.15)] hover:bg-primary-fixed-dim transition-all active:scale-[0.98] font-semibold flex items-center justify-center gap-2"
                >
                    <span>{processing ? 'Memproses...' : 'Simulasikan Pembayaran (Dev)'}</span>
                    <span className="material-symbols-outlined text-[18px]">{processing ? 'hourglass_empty' : 'refresh'}</span>
                </button>
            </div>

            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg font-body-sm text-body-sm shadow-lg flex items-center gap-2 z-[100]">
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">check_circle</span>
                    Nomor VA berhasil disalin
                </div>
            )}
        </ParentLayout>
    );
}