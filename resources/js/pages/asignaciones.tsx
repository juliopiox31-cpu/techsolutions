import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckSquare, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

export default function Asignaciones() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role?.toLowerCase() || '';
    const isAdmin = userRole === 'admin' || userRole === 'administrador';

    const [trabajadores, setTrabajadores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchAsignaciones = async () => {
            try {
                const res = await axios.get('/api/asignaciones');
                setTrabajadores(res.data);
            } catch (error) {
                console.error("Error fetching asignaciones", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAsignaciones();
    }, [isAdmin]);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (!isAdmin) {
        return (
            <AdminLayout title="Acceso Denegado" description="No tienes permisos para ver esta sección.">
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111827]/80 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl">
                    <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acceso Restringido</h3>
                    <p className="text-slate-500 dark:text-slate-400">Esta sección es exclusiva para administradores.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Asignaciones de Trabajadores" 
            description="Supervisa en qué proyectos y tareas están asignados los empleados."
        >
            <Head title="Asignaciones" />

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
            ) : trabajadores.length === 0 ? (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111827]/80 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sin trabajadores</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">No hay empleados registrados en el sistema o no tienen asignaciones.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trabajadores.map((trabajador, index) => (
                        <motion.div 
                            key={trabajador.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300"
                        >
                            {/* Header del Trabajador */}
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center shadow-inner">
                                        <Users className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{trabajador.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trabajador.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumen numérico */}
                            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/5 border-b border-slate-100 dark:border-white/5">
                                <div className="p-4 text-center">
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{trabajador.proyectos_asignados.length}</p>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Proyectos</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{trabajador.total_tareas}</p>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Tareas</p>
                                </div>
                            </div>

                            {/* Lista de Proyectos */}
                            <div className="p-6">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Proyectos Asignados
                                </h4>
                                
                                {trabajador.proyectos_asignados.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">No tiene proyectos asignados actualmente.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {trabajador.proyectos_asignados.map((proyecto: any) => (
                                            <li key={proyecto.id} className="flex items-center gap-3 text-sm">
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${
                                                    proyecto.status === 'En progreso' ? 'bg-blue-500' :
                                                    proyecto.status === 'Completado' ? 'bg-emerald-500' :
                                                    'bg-amber-500'
                                                }`} />
                                                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{proyecto.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
