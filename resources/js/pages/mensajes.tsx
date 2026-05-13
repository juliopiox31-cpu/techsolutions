import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, PlusCircle, CheckCircle2, User, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AdminLayout from '@/layouts/admin-layout';
import { apiErrorMessage } from '@/lib/api-error-message';
import { formatDateTimeGt } from '@/lib/format-datetime-gt';

export default function Mensajes() {
    const [mensajes, setMensajes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMensajes();
    }, []);

    const fetchMensajes = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/mensajes');
            setMensajes(res.data);
        } catch (error) {
            console.error('Error fetching mensajes', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await axios.post(`/api/mensajes/${id}/read`);
            setMensajes(mensajes.map(m => m.id === id ? { ...m, status: 'leido' } : m));
            toast.success('Mensaje marcado como leído.');
        } catch (error) {
            console.error('Error marking as read', error);
            toast.error(apiErrorMessage(error, 'No se pudo actualizar el mensaje.'));
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Bandeja de Entrada" 
            description="Gestiona las dudas de soporte y solicitudes de nuevos proyectos de tus clientes."
        >
            <Head title="Mensajes & Solicitudes" />

            <div className="space-y-6">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Mail className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mensajes de Clientes</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Revisa las solicitudes y ponte en contacto con ellos.</p>
                        </div>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner className="w-10 h-10 text-blue-600" />
                    </div>
                ) : mensajes.length === 0 ? (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111827]/80 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bandeja Vacía</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">No tienes mensajes ni solicitudes de proyectos pendientes en este momento.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {mensajes.map((mensaje, index) => (
                                <motion.div 
                                    key={mensaje.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
                                        mensaje.status === 'pendiente' 
                                        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20 shadow-md shadow-blue-500/5' 
                                        : 'bg-white dark:bg-[#111827]/80 border-slate-200 dark:border-white/[0.08] shadow-sm'
                                    }`}
                                >
                                    {mensaje.status === 'pendiente' && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                                    )}
                                    
                                    <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                                                    mensaje.type === 'proyecto' 
                                                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' 
                                                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {mensaje.type === 'proyecto' ? <PlusCircle className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                                                    {mensaje.type === 'proyecto' ? 'Solicitud de Proyecto' : 'Soporte / Duda'}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDateTimeGt(mensaje.created_at)}
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                {mensaje.subject || (mensaje.type === 'proyecto' ? 'Nueva Solicitud' : 'Nuevo Mensaje')}
                                            </h4>
                                            
                                            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                {mensaje.content}
                                            </p>
                                        </div>

                                        <div className="w-full lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{mensaje.user?.name || 'Cliente Desconocido'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{mensaje.user?.company || 'Sin Empresa'}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 mb-6">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {mensaje.user?.email}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Tel:</span> {mensaje.user?.phone || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {mensaje.status === 'pendiente' ? (
                                                <Button 
                                                    onClick={() => markAsRead(mensaje.id)}
                                                    variant="outline"
                                                    className="w-full border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl"
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Marcar como Leído
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-center w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Atendido
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
