import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Plus, Edit2, Trash2, X, Loader2, CheckSquare, ListTodo, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';
import { apiErrorMessage } from '@/lib/api-error-message';

export default function Tareas() {
    const [tareas, setTareas] = useState<any[]>([]);
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null as number | null, title: '', description: '', proyecto_id: '', user_id: '', status: 'Pendiente' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTareas();
        fetchProyectos();
        fetchUsuarios();
    }, []);

    const fetchTareas = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/tareas');
            setTareas(res.data);
        } catch (error) {
            console.error('Error fetching tareas', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProyectos = async () => {
        try {
            const res = await axios.get('/api/proyectos');
            setProyectos(res.data);
        } catch (error) {
            console.error('Error fetching proyectos', error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const res = await axios.get('/api/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error('Error fetching usuarios', error);
        }
    };

    const handleOpenModal = (tarea: any = null) => {
        if (tarea) {
            setFormData({
                id: tarea.id,
                title: tarea.title,
                description: tarea.description || '',
                proyecto_id: tarea.proyecto_id?.toString() || '',
                user_id: tarea.user_id?.toString() || '',
                status: tarea.status,
            });
            setIsEditing(true);
        } else {
            setFormData({ id: null, title: '', description: '', proyecto_id: '', user_id: '', status: 'Pendiente' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.proyecto_id) {
            toast.error('Debes seleccionar un proyecto para la tarea.');
            return;
        }
        if (isEditing && formData.id == null) {
            toast.error('No se pudo identificar la tarea a editar.');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                proyecto_id: formData.proyecto_id ? parseInt(formData.proyecto_id, 10) : null,
                user_id: formData.user_id ? parseInt(formData.user_id, 10) : null,
            };
            if (isEditing) {
                await axios.put(`/api/tareas/${formData.id}`, payload);
                toast.success('Tarea actualizada correctamente.');
            } else {
                await axios.post('/api/tareas', payload);
                toast.success('Tarea creada correctamente.');
            }
            await fetchTareas();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving tarea', error);
            toast.error(apiErrorMessage(error, 'No se pudo guardar la tarea.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
            return;
        }
        try {
            await axios.delete(`/api/tareas/${id}`);
            toast.success('Tarea eliminada correctamente.');
            await fetchTareas();
        } catch (error) {
            console.error('Error deleting tarea', error);
            toast.error(apiErrorMessage(error, 'No se pudo eliminar la tarea.'));
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pendiente':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'En progreso':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'Completada':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Pendiente':
                return 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]';
            case 'En progreso':
                return 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)] animate-pulse';
            case 'Completada':
                return 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]';
            default:
                return 'bg-slate-500 dark:bg-slate-400';
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Asignación de Tareas" 
            description="Controla el progreso de tareas individuales de tu equipo."
        >
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <ListTodo className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Lista de Tareas</h3>
                            <p className="text-xs text-slate-500">{tareas.length} tarea{tareas.length !== 1 ? 's' : ''} registrada{tareas.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Tarea
                    </button>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center items-center gap-3 py-8 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                            Cargando tareas...
                        </div>
                    ) : tareas.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckSquare className="w-7 h-7 text-emerald-600/60 dark:text-emerald-400/60" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">No hay tareas registradas.</p>
                            <button onClick={() => handleOpenModal()} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors">+ Crear tu primera tarea</button>
                        </div>
                    ) : (
                        tareas.map((tarea) => (
                            <div key={tarea.id} className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-800 dark:text-white truncate">{tarea.title}</p>
                                        {tarea.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{tarea.description}</p>}
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusStyle(tarea.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(tarea.status)}`}></div>
                                        {tarea.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    <span className="bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.05] px-2 py-1 rounded truncate max-w-[120px]">{tarea.proyecto_name}</span>
                                    {tarea.user_name && (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-white shrink-0">
                                                {(tarea.user_name || '?').charAt(0)}
                                            </div>
                                            <span className="truncate max-w-[100px]">{tarea.user_name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">{tarea.date}</span>
                                    <div className="flex items-center gap-1">
                                        <Link href={`/tareas/${tarea.id}`} className="p-2 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" title="Ver detalle">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleOpenModal(tarea)} className="p-2 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(tarea.id)} className="p-2 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="pb-3 px-4 font-semibold">Tarea</th>
                                <th className="pb-3 px-4 font-semibold">Proyecto</th>
                                <th className="pb-3 px-4 font-semibold">Asignado</th>
                                <th className="pb-3 px-4 font-semibold">Estado</th>
                                <th className="pb-3 px-4 font-semibold">Fecha</th>
                                <th className="pb-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                            Cargando tareas...
                                        </div>
                                    </td>
                                </tr>
                            ) : tareas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <CheckSquare className="w-7 h-7 text-emerald-600/60 dark:text-emerald-400/60" />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400">No hay tareas registradas.</p>
                                            <button onClick={() => handleOpenModal()} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors">
                                                + Crear tu primera tarea
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tareas.map((tarea) => (
                                    <tr key={tarea.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{tarea.title}</p>
                                                {tarea.description && (
                                                    <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{tarea.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300">
                                                {tarea.proyecto_name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-white">
                                                    {(tarea.user_name || '?').charAt(0)}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{tarea.user_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(tarea.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(tarea.status)}`}></div>
                                                {tarea.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm">
                                            <div>{tarea.date}</div>
                                            {(tarea.updated_by_name || tarea.created_by_name) && (
                                                <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-1 max-w-[160px] leading-snug">
                                                    {tarea.updated_by_name ? (
                                                        <>Última edición: <span className="text-slate-600 dark:text-slate-400">{tarea.updated_by_name}</span></>
                                                    ) : tarea.created_by_name ? (
                                                        <>Creado por: <span className="text-slate-600 dark:text-slate-400">{tarea.created_by_name}</span></>
                                                    ) : null}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/tareas/${tarea.id}`}
                                                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleOpenModal(tarea)} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(tarea.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Eliminar">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal Crear/Editar Tarea */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-slate-900/60 dark:bg-[#0B1120]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-2xl rounded-2xl w-full max-w-md relative z-10 overflow-hidden transition-colors duration-500"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0B1120]/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título de la Tarea <span className="text-rose-500">*</span></label>
                                    <input 
                                        required type="text" 
                                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" 
                                        placeholder="Ej. Configurar servidor de staging"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                                    <textarea 
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-colors" 
                                        rows={3}
                                        placeholder="Describe los detalles de la tarea..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proyecto <span className="text-rose-500">*</span></label>
                                        <select 
                                            required
                                            value={formData.proyecto_id} onChange={e => setFormData({...formData, proyecto_id: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {proyectos.map((p: any) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asignar a</label>
                                        <select 
                                            value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            <option value="">Sin asignar</option>
                                            {usuarios.map((u: any) => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                                    <select 
                                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Completada">Completada</option>
                                    </select>
                                </div>
                                
                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/[0.05]">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg disabled:opacity-50">
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
