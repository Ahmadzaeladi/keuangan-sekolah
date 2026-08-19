import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function PaymentMethod({ bill }: any) {
    const { data, setData, post, processing } = useForm({
        method: ''
    });

    const formatRp = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('parent.pay.instruction', bill.id));
    };

    return (
        <ParentLayout hideNav={true} title="Pembayaran Online" backUrl={route('parent.bills')}>
            <Head title="Pilih Metode Pembayaran" />

            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden shadow-sm bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L33.2 8.8L42 12L33.2 15.2L30 24L26.8 15.2L18 12L26.8 8.8L30 0Z\' fill=\'%23064E3B\' fill-opacity=\'0.03\'/%3E%3C/svg%3E')] bg-[length:150px] bg-no-repeat bg-[right_top]">
                <div className="relative z-10">
                    <h2 className="font-label-md text-label-md text-outline tracking-widest uppercase mb-2">Ringkasan Tagihan</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">{bill.bill_type.name} {bill.period}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="font-headline-md text-headline-md text-primary-container font-semibold">{formatRp(bill.amount)}</span>
                    </div>
                    <div className="mt-6 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Batas Waktu</span>
                        <span className="font-label-md text-label-md text-primary-container bg-primary-fixed/20 px-3 py-1 rounded-full">{new Date(bill.due_date).toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-headline-md text-body-lg text-on-surface font-semibold mb-2">Pilih Metode Pembayaran</h3>
                
                <div className="flex flex-col gap-3 pb-32">
                    {/* Virtual Account Group */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="w-full flex items-center justify-between p-4 bg-surface-container-lowest">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
                                    <span className="material-symbols-outlined">account_balance</span>
                                </div>
                                <span className="font-body-md text-body-md text-on-surface font-semibold">Virtual Account</span>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border-t border-outline-variant/20">
                            <div className="p-2 flex flex-col gap-2">
                                {['BSI', 'MANDIRI', 'BRI'].map(bank => (
                                    <label key={bank} className="cursor-pointer relative block">
                                        <input 
                                            className="peer sr-only" 
                                            name="payment_method" 
                                            type="radio" 
                                            value={bank} 
                                            checked={data.method === bank}
                                            onChange={(e) => setData('method', e.target.value)}
                                        />
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-transparent hover:bg-surface-container-low transition-all peer-checked:border-primary-container peer-checked:bg-primary-container/5 peer-checked:shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 rounded bg-surface-variant flex items-center justify-center font-label-md text-[10px] text-on-surface-variant">{bank}</div>
                                                <span className="font-body-sm text-body-sm text-on-surface">{bank} Virtual Account</span>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-2 border-outline-variant peer-checked:border-primary-container flex items-center justify-center">
                                                <div className={`w-2.5 h-2.5 rounded-full transition-transform ${data.method === bank ? 'bg-primary-container scale-100' : 'scale-0'}`}></div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* E-Wallet Group */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="w-full flex items-center justify-between p-4 bg-surface-container-lowest">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
                                    <span className="material-symbols-outlined">account_wallet</span>
                                </div>
                                <span className="font-body-md text-body-md text-on-surface font-semibold">E-Wallet</span>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border-t border-outline-variant/20">
                            <div className="p-2 flex flex-col gap-2">
                                {['GOPAY', 'OVO', 'DANA'].map(ewallet => (
                                    <label key={ewallet} className="cursor-pointer relative block">
                                        <input 
                                            className="peer sr-only" 
                                            name="payment_method" 
                                            type="radio" 
                                            value={ewallet} 
                                            checked={data.method === ewallet}
                                            onChange={(e) => setData('method', e.target.value)}
                                        />
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-transparent hover:bg-surface-container-low transition-all peer-checked:border-primary-container peer-checked:bg-primary-container/5 peer-checked:shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 rounded bg-surface-variant flex items-center justify-center font-label-md text-[10px] text-on-surface-variant">{ewallet}</div>
                                                <span className="font-body-sm text-body-sm text-on-surface">{ewallet}</span>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-2 border-outline-variant peer-checked:border-primary-container flex items-center justify-center">
                                                <div className={`w-2.5 h-2.5 rounded-full transition-transform ${data.method === ewallet ? 'bg-primary-container scale-100' : 'scale-0'}`}></div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-40">
                    <div className="max-w-container-max mx-auto">
                        <button 
                            type="submit"
                            disabled={!data.method || processing} 
                            className={`w-full text-on-primary rounded-lg py-4 font-label-md text-label-md uppercase tracking-wide transition-all ${data.method && !processing ? 'bg-primary-container hover:bg-primary shadow-md active:scale-[0.98]' : 'bg-primary-container opacity-50 cursor-not-allowed'}`}>
                            Lanjutkan Pembayaran
                        </button>
                    </div>
                </div>
            </form>
        </ParentLayout>
    );
}