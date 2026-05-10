import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    isLoading?: boolean;
}

export default function StatsCard({ title, value, trend, icon: Icon, color, bg, isLoading = false }: StatsCardProps) {
    const isPositive = trend.startsWith('+');

    if (isLoading) {
        return (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] animate-pulse"></div>
                    <div className="w-16 h-6 rounded-full bg-white/[0.05] animate-pulse"></div>
                </div>
                <div className="w-24 h-4 bg-white/[0.05] rounded mb-2 animate-pulse"></div>
                <div className="w-32 h-8 bg-white/[0.05] rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors relative overflow-hidden group shadow-sm dark:shadow-none"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            {/* Hover Glow Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${bg} blur-[40px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-50 pointer-events-none`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${bg} ${color} border border-slate-200/50 dark:border-white/5 shadow-inner`}>
                    {Icon && <Icon className="w-5 h-5" />}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div className="relative z-10">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
}
