import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, Clock, Briefcase, CheckSquare, Users, ArrowLeft, Building2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
import AdminLayout from '@/layouts/admin-layout';

export default function Actividad() {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // We'll reuse the dashboard API for now to fetch the same activities
        // In a real scenario, you might have a dedicated /api/actividad endpoint with pagination
        const fetchActividad = async () => {
            try {
                const res = await axios.get('/api/dashboard', {
                    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
                    params: { _t: Date.now() },
                });
                // Assume dashboard returns some recent activities, 
                // you could also make a separate /api/activities route in the future
                setActivities(res.data.recentActivities || []);
            } catch (error) {
                console.error("Error fetching activity", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActividad();
    }, []);

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'project': return { icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
            case 'task': return { icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
            case 'user': return { icon: Users, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" };
            case 'client': return { icon: Building2, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
            case 'message': return { icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" };
            case 'status': return { icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" };
            default: return { icon: Activity, color: "text-slate-400", bg: "bg-white/5 border-white/10" };
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Historial de Actividad" 
            description="Visualiza el registro completo de todas las acciones recientes en la plataforma."
        >
            <Head title="Actividad Reciente" />

            <div className="space-y-6">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <Activity className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registro de Actividad</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Consulta los movimientos más recientes del sistema.</p>
                        </div>
                    </div>
                    
                    <Link href="/dashboard" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Link>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner className="w-10 h-10 text-indigo-600" />
                    </div>
                ) : activities.length === 0 ? (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111827]/80 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Activity className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sin actividad reciente</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">No se han registrado movimientos en el sistema por el momento.</p>
                    </motion.div>
                ) : (
                    <div className="bg-white dark:bg-[#111827]/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-white/[0.08] p-8">
                        <div className="flex flex-col gap-8 relative">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/30 via-slate-200 dark:via-white/10 to-transparent"></div>

                            {activities.map((act, index) => {
                                const info = getIconInfo(act.type);
                                const Icon = info.icon;
                                return (
                                    <motion.div 
                                        key={act.id} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex gap-6 relative z-10 group"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${info.bg} border ${info.color} ring-8 ring-white dark:ring-[#111827] transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="pt-2 flex-1 pb-6 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {act.title}
                                                </h4>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-wider bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-full w-fit">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {act.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {act.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
