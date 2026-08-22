import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function Notifications({ serverNotifications }: any) {
    const [filter, setFilter] = useState('Semua');
    
    const notifications = serverNotifications || [];

    const filtered = filter === 'Semua' ? notifications : notifications.filter((n: any) => n.filterType === filter);

    return (
        <ParentLayout title="Pusat Notifikasi">
            <Head title="Pusat Notifikasi" />
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-base space-y-6 pb-8">
                {/* Page Header */}
                <div className="flex flex-col space-y-2 mb-8 hidden md:flex">
                    <p className="font-body-md text-body-md text-on-surface-variant">Pembaruan terkini mengenai tagihan, pembayaran, dan informasi sekolah.</p>
                </div>
                
                {/* Filter Chips */}
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
                    {['Semua', 'Tagihan', 'Pembayaran', 'Pengumuman'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-transform duration-200 active:scale-95 ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filtered.map((notif: any) => (
                        <div key={notif.id} className={`bg-surface rounded-xl p-4 border border-outline-variant shadow-[0_4px_12px_rgba(6,78,59,0.05)] flex gap-4 items-start relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-200 cursor-pointer ${notif.opacityClass || ''} ${notif.patternBg ? 'bg-[url(\'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 3.33331C10.8 3.33331 3.33331 10.8 3.33331 20C3.33331 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6666 29.2 36.6666 20C36.6666 10.8 29.2 3.33331 20 3.33331ZM20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z" fill="%23064E3B" fill-opacity="0.03" fill-rule="evenodd"/%3E%3C/svg%3E\')] bg-repeat' : ''}`}>
                            {notif.unread && (
                                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${notif.typeColor.replace('text-', 'bg-')}`}></div>
                            )}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${notif.iconBg} flex items-center justify-center ${notif.iconColor}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{notif.icon}</span>
                            </div>
                            <div className="flex-1 space-y-1 pr-4 z-10 relative">
                                <div className="flex justify-between items-baseline">
                                    <span className={`font-label-md text-label-md ${notif.typeColor}`}>{notif.type}</span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">{notif.time}</span>
                                </div>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">{notif.title}</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{notif.desc}</p>
                                {notif.actionText && notif.actionUrl ? (
                                    <Link href={notif.actionUrl} className={`mt-2 ${notif.typeColor === 'text-error' ? 'text-primary' : 'text-on-surface-variant'} font-label-md text-label-md flex items-center gap-1 group-hover:underline`}>
                                        {notif.actionText} <span className="material-symbols-outlined text-[16px]">{notif.actionIcon}</span>
                                    </Link>
                                ) : notif.actionText ? (
                                    <button className={`mt-2 ${notif.typeColor === 'text-error' ? 'text-primary' : 'text-on-surface-variant'} font-label-md text-label-md flex items-center gap-1 group-hover:underline`}>
                                        {notif.actionText} <span className="material-symbols-outlined text-[16px]">{notif.actionIcon}</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ParentLayout>
    );
}