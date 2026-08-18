import React from 'react';
import { cn } from '../../Layouts/DashboardLayout';

export function Badge({ className, variant = 'default', children }: { className?: string, variant?: 'default'|'success'|'danger'|'warning', children: React.ReactNode }) {
    const variants = {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        success: 'bg-green-50 text-green-700 border-green-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", variants[variant], className)}>
            {children}
        </span>
    );
}