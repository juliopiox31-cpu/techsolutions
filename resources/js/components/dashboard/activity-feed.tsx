import React from 'react';
import { Link } from '@inertiajs/react';
import { Briefcase, CheckSquare, Users, Activity, Clock } from 'lucide-react';

interface ActivityItem {
    id: number;
    title: string;
    desc: string;
    time: string;
    type: string;
}

interface ActivityFeedProps {
    activities: ActivityItem[];
    isLoading?: boolean;
}

export default function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
    if (isLoading) {
        return (
            <div className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-white/[0.08] flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-32 h-6 bg-white/[0.05] rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-white/[0.05] rounded animate-pulse"></div>
                </div>
                <div className="flex-1 flex flex-col gap-6 relative">
                    <div className="absolute left-5 top-5 bottom-5 w-px bg-white/[0.05]"></div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white/[0.05] ring-4 ring-[#0B1120] animate-pulse"></div>
                            <div className="flex-1 pt-1">
                                <div className="w-32 h-4 bg-white/[0.05] rounded mb-2 animate-pulse"></div>
                                <div className="w-48 h-3 bg-white/[0.05] rounded mb-2 animate-pulse"></div>
                                <div className="w-20 h-3 bg-white/[0.05] rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'project': return { icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
            case 'task': return { icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
            case 'user': return { icon: Users, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" };
            case 'status': return { icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" };
            default: return { icon: Activity, color: "text-slate-400", bg: "bg-white/5 border-white/10" };
        }
    };

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] flex flex-col h-full shadow-sm dark:shadow-none transition-colors duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Actividad Reciente</h3>
                <Link href="/actividad" className="text-sm font-medium text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors">Ver todo</Link>
            </div>

            <div className="flex-1 flex flex-col gap-6 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/30 via-slate-200 dark:via-white/10 to-transparent"></div>

                {activities.map((act) => {
                    const info = getIconInfo(act.type);
                    const Icon = info.icon;
                    return (
                        <div key={act.id} className="flex gap-4 relative z-10 group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${info.bg} border ${info.color} ring-4 ring-white dark:ring-[#0B1120] transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="pt-0.5">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{act.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{act.desc}</p>
                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                                    <Clock className="w-3 h-3" />
                                    {act.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
