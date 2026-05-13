import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Briefcase, 
    Clock, 
    CheckCircle2, 
    MessageSquare, 
    Send, 
    User as UserIcon,
    ArrowRight,
    Loader2,
    PlusCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { apiErrorMessage } from '@/lib/api-error-message';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AdminLayout from '@/layouts/admin-layout';

export default function ClienteDashboard() {
    const { auth } = usePage().props as any;
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [isRequesting, setIsRequesting] = useState(false);
    const [requestForm, setRequestForm] = useState({ title: '', description: '' });
    const [requestSuccess, setRequestSuccess] = useState(false);

    const handleRequestProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestForm.title.trim() || !requestForm.description.trim()) return;

        setIsRequesting(true);
        try {
            await axios.post('/api/mensajes', {
                type: 'proyecto',
                subject: requestForm.title,
                content: requestForm.description
            });
            toast.success('Solicitud de proyecto enviada correctamente.');
            setRequestSuccess(true);
            setRequestForm({ title: '', description: '' });
            setTimeout(() => setRequestSuccess(false), 5000);
        } catch (error) {
            console.error("Error requesting project", error);
            toast.error(apiErrorMessage(error, 'No se pudo enviar la solicitud de proyecto.'));
        } finally {
            setIsRequesting(false);
        }
    };

    useEffect(() => {
        fetchProyectos();
    }, []);

    const fetchProyectos = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/cliente/proyectos');
            setProyectos(res.data);
        } catch (error) {
            console.error("Error fetching client proyectos", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        try {
            await axios.post('/api/mensajes', {
                type: 'soporte',
                subject: 'Consulta de soporte general',
                content: message
            });
            toast.success('Mensaje enviado correctamente.');
            setShowSuccess(true);
            setMessage('');
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending message", error);
            toast.error(apiErrorMessage(error, 'No se pudo enviar el mensaje.'));
        } finally {
            setIsSending(false);
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title={`Bienvenido, ${auth.user.name}`} 
            description={`Panel de seguimiento para ${auth.user.company || 'tu empresa'}`}
        >
            <Head title="Mi Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects Section */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                            Mis Proyectos
                        </h3>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    ) : proyectos.length === 0 ? (
                        <motion.div variants={fadeUp} className="p-12 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-slate-400" />
                            </div>
                            <h4 className="text-lg font-medium text-slate-900 dark:text-white">Sin proyectos activos</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Actualmente no tienes proyectos registrados en seguimiento.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {proyectos.map((proyecto) => (
                                <motion.div 
                                    key={proyecto.id}
                                    variants={fadeUp}
                                    className="p-6 rounded-[2rem] bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{proyecto.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{proyecto.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                            proyecto.status === 'En progreso' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 
                                            proyecto.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                            'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                        }`}>
                                            {proyecto.status}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Progreso General</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">{proyecto.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${proyecto.progress}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Tareas</p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">{proyecto.tareas_count}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Completadas</p>
                                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{proyecto.tareas_completadas}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider font-semibold">Pendientes</p>
                                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{proyecto.tareas_pendientes}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Request Project Section */}
                    <motion.div 
                        variants={fadeUp} 
                        className="mt-8 p-8 rounded-[2rem] bg-gradient-to-r from-blue-600/5 to-cyan-500/5 dark:from-blue-600/10 dark:to-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Solicitar Nuevo Proyecto</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                    ¿Tienes una nueva idea o requerimiento? Cuéntanos brevemente de qué se trata y nuestro equipo se pondrá en contacto contigo para cotizar y planificar tu próximo proyecto.
                                </p>

                                <form onSubmit={handleRequestProject} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <input 
                                                type="text" 
                                                value={requestForm.title}
                                                onChange={(e) => setRequestForm({...requestForm, title: e.target.value})}
                                                placeholder="Nombre del Proyecto (Ej. Nueva Sucursal)"
                                                className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <textarea 
                                                value={requestForm.description}
                                                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                                                placeholder="Describe brevemente los requerimientos principales..."
                                                className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <AnimatePresence>
                                            {requestSuccess && (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    ¡Solicitud enviada exitosamente!
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        <div className={requestSuccess ? "" : "ml-auto"}>
                                            <Button 
                                                type="submit"
                                                disabled={isRequesting || !requestForm.title.trim() || !requestForm.description.trim()}
                                                className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all group"
                                            >
                                                {isRequesting ? (
                                                    <Spinner className="mr-2" />
                                                ) : (
                                                    <>
                                                        Enviar Solicitud
                                                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar: Contact & Info */}
                <div className="space-y-8">
                    {/* Project Manager Contact */}
                    <motion.div 
                        variants={fadeUp}
                        className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                        
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            Contacto Directo
                        </h3>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                <UserIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Soporte Técnico</p>
                                <p className="text-xs text-slate-400">Tu gestor de proyectos</p>
                            </div>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu duda o comentario..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] transition-all"
                            />
                            
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs text-center"
                                    >
                                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button 
                                type="submit"
                                disabled={isSending || !message.trim()}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all group"
                            >
                                {isSending ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        Enviar Mensaje
                                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div 
                        variants={fadeUp}
                        className="p-6 rounded-[2rem] bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08]"
                    >
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Información de Cuenta</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Empresa</span>
                                <span className="text-slate-900 dark:text-slate-200 font-bold">{auth.user.company || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-3 border-t border-slate-100 dark:border-white/[0.05]">
                                <span className="text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Correo</span>
                                <span className="text-slate-900 dark:text-slate-200 font-bold">{auth.user.email}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-3 border-t border-slate-100 dark:border-white/[0.05]">
                                <span className="text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">Teléfono</span>
                                <span className="text-slate-900 dark:text-slate-200 font-bold">{auth.user.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
