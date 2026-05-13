import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { Mail, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export interface PieDatum {
    name: string;
    value: number;
}

export interface WeeklyDatum {
    name: string;
    proyectos: number;
    tareas: number;
}

export interface TopClienteDatum {
    name: string;
    proyectos: number;
}

interface DashboardInsightsProps {
    proyectosPie: PieDatum[];
    tareasPie: PieDatum[];
    weekly: WeeklyDatum[];
    topClientes: TopClienteDatum[];
    mensajesStats: { pendiente: number; leido: number };
    isLoading?: boolean;
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#64748b', '#06b6d4', '#f43f5e'];

function tooltipStyle(isDark: boolean) {
    return {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : '#fff',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        color: isDark ? '#fff' : '#0f172a',
    };
}

function ChartShell({
    title,
    subtitle,
    icon: Icon,
    children,
    className = '',
}: {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-white/[0.08] dark:bg-[#111827]/80 dark:shadow-none ${className}`}
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/[0.06] dark:bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-blue-500 dark:text-cyan-400" />
                </div>
            </div>
            {children}
        </div>
    );
}

function PieBlock({
    title,
    subtitle,
    data,
    isLoading,
    isDark,
}: {
    title: string;
    subtitle: string;
    data: PieDatum[];
    isLoading: boolean;
    isDark: boolean;
}) {
    if (isLoading) {
        return (
            <ChartShell title={title} subtitle={subtitle} icon={PieIcon} className="min-h-[320px]">
                <div className="h-[240px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
            </ChartShell>
        );
    }

    const isPlaceholder = data.length === 0;
    const safe = isPlaceholder ? [{ name: 'Sin datos', value: 1 }] : data;

    return (
        <ChartShell title={title} subtitle={subtitle} icon={PieIcon} className="min-h-[320px]">
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={safe}
                            cx="50%"
                            cy="50%"
                            innerRadius={56}
                            outerRadius={88}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            strokeWidth={0}
                        >
                            {safe.map((_, i) => (
                                <Cell key={i} fill={isPlaceholder ? '#64748b' : PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [Number(value ?? 0), String(name ?? '')]}
                            contentStyle={tooltipStyle(isDark)}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </ChartShell>
    );
}

export default function DashboardInsights({
    proyectosPie,
    tareasPie,
    weekly,
    topClientes,
    mensajesStats,
    isLoading = false,
}: DashboardInsightsProps) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PieBlock
                    title="Proyectos por estado"
                    subtitle="Distribución actual del portafolio"
                    data={proyectosPie}
                    isLoading={isLoading}
                    isDark={isDark}
                />
                <PieBlock
                    title="Tareas por estado"
                    subtitle="Carga de trabajo del equipo"
                    data={tareasPie}
                    isLoading={isLoading}
                    isDark={isDark}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ChartShell
                    title="Actividad últimos 7 días"
                    subtitle="Altas por día (zona Guatemala)"
                    icon={BarChart3}
                    className="min-h-[320px] lg:col-span-2"
                >
                    {isLoading ? (
                        <div className="h-[240px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
                    ) : (
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weekly} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'currentColor', fontSize: 11 }}
                                        className="text-slate-500 dark:text-slate-400"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fill: 'currentColor', fontSize: 11 }}
                                        className="text-slate-500 dark:text-slate-400"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip contentStyle={tooltipStyle(isDark)} />
                                    <Legend />
                                    <Bar dataKey="proyectos" name="Proyectos nuevos" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                    <Bar dataKey="tareas" name="Tareas nuevas" fill="#22d3ee" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartShell>

                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-white/[0.08] dark:from-[#0f172a]/80 dark:to-[#111827]/80 dark:shadow-none">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bandeja</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Mensajes del sistema</p>
                            </div>
                            <div className="rounded-xl border border-violet-200 bg-violet-50 p-2 dark:border-violet-500/20 dark:bg-violet-500/10">
                                <Mail className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-14 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/[0.06]" />
                                <div className="h-14 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/[0.06]" />
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                <li className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Pendientes</span>
                                    <span className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">{mensajesStats.pendiente}</span>
                                </li>
                                <li className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/[0.08] dark:bg-[#0b1220]/60">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Leídos</span>
                                    <span className="text-2xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{mensajesStats.leido}</span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <ChartShell
                title="Clientes con más proyectos"
                subtitle="Top según número de proyectos asociados"
                icon={BarChart3}
                className="min-h-[340px]"
            >
                {isLoading ? (
                    <div className="h-[260px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
                ) : topClientes.length === 0 ? (
                    <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">Aún no hay clientes con proyectos registrados.</p>
                ) : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topClientes} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} className="text-slate-500 dark:text-slate-400" />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={120}
                                    tick={{ fontSize: 11 }}
                                    className="text-slate-600 dark:text-slate-300"
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle(isDark)}
                                    formatter={(value) => [`${Number(value ?? 0)} proyecto${Number(value ?? 0) !== 1 ? 's' : ''}`, 'Total']}
                                />
                                <Bar dataKey="proyectos" name="Proyectos" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </ChartShell>
        </div>
    );
}
