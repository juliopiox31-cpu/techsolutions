import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MoreVertical } from 'lucide-react';

import { useAppearance } from '@/hooks/use-appearance';

interface DashboardChartProps {
    data: any[];
    isLoading?: boolean;
}

export default function DashboardChart({ data, isLoading = false }: DashboardChartProps) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    if (isLoading) {
        return (
            <div className="w-full p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-white/[0.08] flex flex-col h-[350px]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="w-48 h-6 bg-white/[0.05] rounded mb-2 animate-pulse"></div>
                        <div className="w-64 h-4 bg-white/[0.05] rounded animate-pulse"></div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] animate-pulse"></div>
                </div>
                <div className="flex-1 w-full bg-white/[0.02] rounded-lg animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] flex flex-col h-[350px] relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-500">
            {/* Subtle glow behind the chart */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-blue-500/5 blur-[50px] pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Crecimiento y Actividad</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Altas por mes (proyectos y tareas nuevos en el año)</p>
                </div>
                <button className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/[0.05]">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 w-full relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProyectos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTareas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            stroke="currentColor" 
                            className="text-slate-400 dark:text-white/20"
                            tick={{ fill: 'currentColor', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            stroke="currentColor" 
                            className="text-slate-400 dark:text-white/20"
                            tick={{ fill: 'currentColor', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : '#fff', 
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                color: isDark ? '#fff' : '#0f172a'
                            }}
                            itemStyle={{ color: 'inherit', fontSize: '13px' }}
                            labelStyle={{ color: isDark ? '#94A3B8' : '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}
                            cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', className: 'text-slate-200 dark:text-white/10' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="proyectos" 
                            name="Proyectos creados (mes)"
                            stroke="#3B82F6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorProyectos)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6', className: 'shadow-[0_0_10px_#3B82F6]' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="tareas" 
                            name="Tareas creadas (mes)"
                            stroke="#38BDF8" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTareas)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#38BDF8', className: 'shadow-[0_0_10px_#38BDF8]' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
