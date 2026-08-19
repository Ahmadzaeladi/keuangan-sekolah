import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';

export default function Profile() {
    const user = usePage().props.auth.user as any;

    return (
        <ParentLayout title="Profil Siswa">
            <Head title="Profil & Akun Siswa" />
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-0 flex flex-col md:flex-row gap-8 pb-8">
                {/* Main Content Area */}
                <div className="flex-1 max-w-3xl space-y-8 mt-4 md:mt-0 md:ml-4">
                    {/* Profile Section */}
                    <section className="bg-[#FFFFFF] rounded-[16px] border border-[#E2E8F0] shadow-sm relative overflow-hidden transition-shadow hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[url('data:image/svg+xml;utf8,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0zm0 2c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18S29.941 2 20 2zm0 4c7.732 0 14 6.268 14 14s-6.268 14-14 14S6 27.732 6 20 12.268 6 20 6zm0 2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z\' fill=\'%23064E3B\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] rounded-tr-[16px]"></div>
                        
                        <h2 className="font-headline-md text-headline-md text-primary mb-6 relative z-10">Profile Details</h2>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 relative z-10">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container shadow-sm bg-surface-container-high flex items-center justify-center text-primary">
                                    {user.photo ? (
                                        <img className="w-full h-full object-cover" src={user.photo} alt="Profile" />
                                    ) : (
                                        <span className="material-symbols-outlined text-[48px]">person</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface">{user.name}</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Parent Account • Joined 2021</p>
                                <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">Status: Aktif</p>
                            </div>
                        </div>

                        <form className="space-y-4 relative z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-label-md text-label-md text-outline mb-1">Nama Lengkap</label>
                                    <input className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors bg-surface-container-low" type="text" value={user.name} readOnly />
                                </div>
                                <div>
                                    <label className="block font-label-md text-label-md text-outline mb-1">Username</label>
                                    <input className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors bg-surface-container-low" type="text" value={user.email?.split('@')[0] || ''} readOnly />
                                </div>
                            </div>
                            <div>
                                <label className="block font-label-md text-label-md text-outline mb-1">Email Address</label>
                                <input className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors bg-surface-container-low" type="email" value={user.email} readOnly />
                            </div>
                            <div>
                                <label className="block font-label-md text-label-md text-outline mb-1">Phone Number</label>
                                <input className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-colors bg-surface-container-low" type="tel" value="+62 812-3456-7890" readOnly />
                            </div>
                        </form>
                    </section>

                    {/* Security Section */}
                    <section className="bg-[#FFFFFF] rounded-[16px] border border-[#E2E8F0] shadow-sm p-6 transition-shadow hover:shadow-[0_4px_12px_rgba(6,78,59,0.05)] mb-8">
                        <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">lock</span>
                            Security
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <h4 className="font-body-md text-body-md text-on-surface font-semibold">Change Password</h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Last changed 3 months ago</p>
                                </div>
                                <button className="px-4 py-2 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">Update</button>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-center mt-8">
                        <Link href={route('logout')} method="post" as="button" className="w-full flex justify-center items-center gap-3 bg-error-container text-error px-6 py-4 rounded-xl font-headline-md hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined">logout</span>
                            Keluar dari SIKOLA
                        </Link>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}