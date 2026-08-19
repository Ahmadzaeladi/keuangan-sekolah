import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import FlashToaster from "@/Components/FlashToaster";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = usePage().props.auth.user;
    const { url } = usePage();

    const navigationGroups = [
        {
            name: "Utama",
            items: [
                { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
            ],
        },
        {
            name: "KEUANGAN",
            items: [
                {
                    name: "Pemasukan",
                    href: "/finance/income",
                    icon: "trending_up",
                },
                {
                    name: "Pengeluaran",
                    href: "/finance/expenses",
                    icon: "trending_down",
                },
                {
                    name: "Kas",
                    href: "/finance/cash",
                    icon: "account_balance_wallet",
                },
            ],
        },
        {
            name: "PEMBAYARAN",
            items: [
                { name: "Tagihan", href: "/bills", icon: "receipt_long" },
                { name: "Pembayaran", href: "/payments", icon: "payments" },
                {
                    name: "Tunggakan",
                    href: "/arrears",
                    icon: "notification_important",
                },
            ],
        },
        {
            name: "SISWA",
            items: [{ name: "Data Siswa", href: "/students", icon: "group" }],
        },
        {
            name: "LAPORAN",
            items: [
                {
                    name: "Laporan Keuangan",
                    href: "/reports/finance",
                    icon: "description",
                },
                {
                    name: "Histori Pembayaran",
                    href: "/reports/payments",
                    icon: "history",
                },
            ],
        },
    ];

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        Utama: true,
        KEUANGAN: true,
        PEMBAYARAN: true,
        SISWA: true,
        LAPORAN: true,
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleGroup = (groupName: string) => {
        if (isSidebarCollapsed) setIsSidebarCollapsed(false); // Auto-expand sidebar if trying to toggle a group
        setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const mobileNav = [
        { name: "Home", href: "/dashboard", icon: "home" },
        { name: "Kas", href: "/finance/cash", icon: "account_balance" },
        { name: "Bayar", href: "/payments", icon: "payments" },
        { name: "Siswa", href: "/students", icon: "person" },
    ];

    return (
        <div className="flex w-full h-screen overflow-hidden bg-surface text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant p-4 z-40 transition-all duration-300",
                    isSidebarCollapsed ? "w-[80px] items-center" : "w-[240px]",
                )}
            >
                <div
                    className={cn(
                        "flex items-center py-4 mb-2 relative w-full",
                        isSidebarCollapsed ? "justify-center px-0" : "px-2",
                    )}
                >
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            mosque
                        </span>
                    </div>
                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300 ml-3",
                            isSidebarCollapsed
                                ? "w-0 opacity-0"
                                : "w-[150px] opacity-100",
                        )}
                    >
                        <h1 className="text-lg font-bold text-primary leading-none whitespace-nowrap pb-2 pt-2">
                            Portal Keuangan
                        </h1>
                    </div>

                    <button
                        onClick={() =>
                            setIsSidebarCollapsed(!isSidebarCollapsed)
                        }
                        className="absolute -right-7 top-6 w-6 h-6 bg-surface-container-low border border-outline-variant rounded-full flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors shadow-sm z-50"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {isSidebarCollapsed
                                ? "chevron_right"
                                : "chevron_left"}
                        </span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden w-full space-y-4 pb-4 styled-scrollbar">
                    {navigationGroups.map((group) => (
                        <div key={group.name} className="flex flex-col">
                            {group.name !== "Utama" && (
                                <button
                                    onClick={() => toggleGroup(group.name)}
                                    className={cn(
                                        "w-full flex items-center px-2 text-[11px] font-semibold tracking-wider text-on-surface-variant/70 uppercase mb-2 hover:text-primary transition-colors",
                                        isSidebarCollapsed
                                            ? "justify-center"
                                            : "justify-between",
                                    )}
                                    title={group.name}
                                >
                                    <span
                                        className={cn(
                                            "whitespace-nowrap transition-all duration-300",
                                            isSidebarCollapsed
                                                ? "w-0 opacity-0 hidden"
                                                : "opacity-100",
                                        )}
                                    >
                                        {group.name}
                                    </span>
                                    {!isSidebarCollapsed && (
                                        <span
                                            className={cn(
                                                "material-symbols-outlined text-[16px] transition-transform duration-300",
                                                openGroups[group.name]
                                                    ? "rotate-180"
                                                    : "rotate-0",
                                            )}
                                        >
                                            expand_more
                                        </span>
                                    )}
                                    {isSidebarCollapsed && (
                                        <span className="block w-4 border-b-2 border-outline-variant/30"></span>
                                    )}
                                </button>
                            )}

                            <div
                                className={cn(
                                    "grid transition-all duration-300 ease-in-out w-full",
                                    openGroups[group.name] || isSidebarCollapsed
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0",
                                )}
                            >
                                <div className="overflow-hidden space-y-1 w-full">
                                    {group.items.map((item) => {
                                        const isActive = url.startsWith(
                                            item.href,
                                        );
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                title={item.name}
                                                className={cn(
                                                    "flex items-center rounded-lg text-sm transition-all overflow-hidden",
                                                    isSidebarCollapsed
                                                        ? "justify-center p-2 mx-auto w-10 h-10"
                                                        : "px-3 py-2.5 w-full",
                                                    isActive
                                                        ? "bg-primary-container text-on-primary-container font-semibold"
                                                        : "text-on-surface-variant hover:bg-surface-container-highest font-medium",
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "material-symbols-outlined text-[20px] shrink-0",
                                                        !isSidebarCollapsed &&
                                                            "mr-3",
                                                    )}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "whitespace-nowrap transition-all duration-300",
                                                        isSidebarCollapsed
                                                            ? "w-0 opacity-0 hidden"
                                                            : "opacity-100",
                                                    )}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </nav>
                <div className="mt-auto pt-4 border-t border-outline-variant space-y-2 w-full flex flex-col items-center">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        title="Logout"
                        className={cn(
                            "text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm font-medium text-error transition-all flex items-center",
                            isSidebarCollapsed
                                ? "justify-center w-10 h-10 p-0 mx-auto"
                                : "px-3 py-2.5 w-full",
                        )}
                    >
                        <span
                            className={cn(
                                "material-symbols-outlined text-[20px] text-error shrink-0",
                                !isSidebarCollapsed && "mr-3",
                            )}
                        >
                            logout
                        </span>
                        <span
                            className={cn(
                                "whitespace-nowrap transition-all duration-300",
                                isSidebarCollapsed
                                    ? "w-0 opacity-0 hidden"
                                    : "opacity-100",
                            )}
                        >
                            Logout
                        </span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex-1 flex flex-col w-full h-full relative transition-all duration-300",
                    isSidebarCollapsed ? "md:ml-[80px]" : "md:ml-[240px]",
                )}
            >
                {/* Mobile Top Nav */}
                <header className="md:hidden flex justify-between items-center w-full px-4 h-14 bg-surface fixed top-0 z-40 border-b border-outline-variant">
                    <h1 className="text-lg text-primary font-bold truncate flex items-center">
                        <span className="material-symbols-outlined mr-2 text-[20px]">
                            mosque
                        </span>{" "}
                        Darul Kurnia Cendekia
                    </h1>
                    <div className="flex items-center space-x-4 text-primary">
                        <button className="hover:text-primary-container transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                                notifications
                            </span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pt-20 md:pt-8 px-4 md:px-8 bg-background pb-20 md:pb-8">
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface rounded-t-xl shadow-[0_-4px_12px_rgba(6,78,59,0.05)] border-t border-outline-variant">
                    {mobileNav.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-transform",
                                    isActive
                                        ? "bg-primary-container text-on-primary-container"
                                        : "text-on-surface-variant",
                                )}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {item.icon}
                                </span>
                                <span className="font-label-md text-[10px] mt-1">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <FlashToaster />
        </div>
    );
}
