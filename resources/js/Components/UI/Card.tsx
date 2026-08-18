import React from 'react';
import { cn } from '../../Layouts/DashboardLayout';

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
            {children}
        </div>
    );
}
export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("px-6 py-5 border-b border-slate-100", className)}>{children}</div>;
}
export function CardTitle({ className, children }: { className?: string, children: React.ReactNode }) {
    return <h3 className={cn("text-lg font-semibold leading-6 text-slate-900", className)}>{children}</h3>;
}
export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("px-6 py-5", className)}>{children}</div>;
}