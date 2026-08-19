import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashToaster from '@/Components/FlashToaster';

export default function ParentLayout({ children, hideNav = false, title = 'Amanah Finance', backUrl = null }: { children: React.ReactNode, hideNav?: boolean, title?: string, backUrl?: string | null }) {
    const user = usePage().props.auth.user as any;
    const { url } = usePage();

    const isActive = (path: string) => url.startsWith(path);

    if (hideNav) {
        return (
            <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative pb-32">
                <FlashToaster />
                <header className="bg-surface border-b border-outline-variant/20 fixed top-0 left-0 w-full flex items-center justify-between px-margin-mobile h-16 z-50">
                    {backUrl ? (
                        <Link href={backUrl} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors text-primary active:scale-95">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
                        </Link>
                    ) : (
                        <div className="w-10"></div>
                    )}
                    <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">{title}</h1>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline-variant">help_outline</span>
                    </div>
                </header>
                <main className="flex-1 mt-16 px-margin-mobile pt-6 flex flex-col gap-6 max-w-container-max mx-auto w-full">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0 font-body-md text-body-md overflow-x-hidden">
            <FlashToaster />
            {/* TopAppBar */}
            <header className="w-full top-0 left-0 bg-background flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto z-40 sticky md:relative">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="font-headline-md text-headline-md font-bold text-primary">Halo, {user.name}</h1>
                        <p className="font-body-sm text-on-surface-variant">
                            {user.class_name ? `Siswa Kelas ${user.class_name}` : 'Selamat datang di Portal SIKOLA'}
                        </p>
                    </div>
                </div>
                <Link href={route('parent.profile')} className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden cursor-pointer transition-transform duration-200 active:scale-95 hover:opacity-80 border-2 border-outline-variant flex items-center justify-center text-primary" title="Profil">
                    {user.photo ? (
                        <img alt="Foto Siswa" className="w-full h-full object-cover" src={user.photo} />
                    ) : (
                        <span className="material-symbols-outlined text-[24px]">person</span>
                    )}
                </Link>
            </header>

            {/* Side Navigation (Desktop) */}
            <nav className="hidden md:flex flex-col h-full w-80 fixed left-0 top-0 z-50 bg-surface border-r border-outline-variant shadow-xl">
                <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high">
                        <img alt="Parent Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGiR36WiEFFGmIl5y_jjH6SQtYTaUwOBXajXzm5Db-kP1b15vOwyXqu1KHxT1QEF2rWeuyb1LyL-VmtcHfg0qLEZO68YafgpPjfEllE7ZPOza7m7LXjhpsvO3_fAQvxwFh61Lh7qsOvvYnD0rhBgyxbxhkfn2fUWOlOnn_Vx1s6pGGqRFh09PObd4l3dYIgbDFcMRs9Q1ok27fMBPmZl4dNdIz_0intBo9tHtNUp8vOScxg-S8sU8B" />
                    </div>
                    <div>
                        <h2 className="font-headline-md text-headline-md text-primary" style={{ fontSize: '18px', lineHeight: '24px' }}>{user.name}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Islamic School Portal</p>
                    </div>
                </div>
                <div className="flex-1 py-4 overflow-y-auto">
                    <Link href={route('parent.dashboard')} className={`flex items-center gap-4 rounded-lg m-2 px-4 py-3 transition-colors duration-200 ${isActive('/parent/dashboard') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:opacity-80'}`}>
                        <span className="material-symbols-outlined">dashboard</span> Dashboard
                    </Link>
                    <Link href={route('parent.bills')} className={`flex items-center gap-4 rounded-lg m-2 px-4 py-3 transition-colors duration-200 ${isActive('/parent/bills') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:opacity-80'}`}>
                        <span className="material-symbols-outlined">receipt_long</span> Tagihan & Riwayat
                    </Link>
                    <Link href={route('parent.notifications')} className={`flex items-center gap-4 rounded-lg m-2 px-4 py-3 transition-colors duration-200 ${isActive('/parent/notifications') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:opacity-80'}`}>
                        <span className="material-symbols-outlined">notifications</span> Pusat Notifikasi
                    </Link>
                    <Link href={route('parent.profile')} className={`flex items-center gap-4 rounded-lg m-2 px-4 py-3 transition-colors duration-200 ${isActive('/parent/profile') ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:opacity-80'}`}>
                        <span className="material-symbols-outlined">person</span> Profil & Akun
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-4 text-error hover:bg-error-container/50 rounded-lg m-2 px-4 py-3 transition-colors duration-200 w-full text-left">
                        <span className="material-symbols-outlined">logout</span> Keluar
                    </Link>
                </div>
                <div className="p-6 border-t border-outline-variant/30">
                    <p className="font-label-md text-label-md text-on-surface-variant text-center">Amanah v1.0</p>
                </div>
            </nav>

            {/* Main Content */}
            <div className="md:ml-80">
                {children}
            </div>

            {/* Bottom Nav (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface shadow-[0_-4px_12px_rgba(6,78,59,0.05)] rounded-t-xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' }}>
                <Link href={route('parent.dashboard')} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 w-16 ${isActive('/parent/dashboard') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/parent/dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                    <span className="font-label-md text-[10px] mt-1">Home</span>
                </Link>
                <Link href={route('parent.bills')} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 w-16 ${isActive('/parent/bills') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/parent/bills') ? "'FILL' 1" : "'FILL' 0" }}>receipt_long</span>
                    <span className="font-label-md text-[10px] mt-1">Bills</span>
                </Link>
                <Link href={route('parent.notifications')} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 w-16 ${isActive('/parent/notifications') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/parent/notifications') ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
                    <span className="font-label-md text-[10px] mt-1">Alerts</span>
                </Link>
                <Link href={route('parent.profile')} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 w-16 ${isActive('/parent/profile') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/parent/profile') ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                    <span className="font-label-md text-[10px] mt-1">Profil</span>
                </Link>
            </nav>
        </div>
    );
}