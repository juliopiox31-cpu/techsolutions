import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Briefcase, FolderKanban } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

export default function Proyectos() {
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null as number | null, name: '', description: '', cliente_id: '', status: 'En progreso' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProyectos();
        fetchClientes();
    }, []);

    const fetchProyectos = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/proyectos');
            setProyectos(res.data);
        } catch (error) {
            console.error("Error fetching proyectos", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClientes = async () => {
        try {
            const res = await axios.get('/api/clientes');
            setClientes(res.data);
        } catch (error) {
            console.error("Error fetching clientes", error);
        }
    };

    const handleOpenModal = (proyecto: any = null) => {
        if (proyecto) {
            setFormData({
                id: proyecto.id,
                name: proyecto.name,
                description: proyecto.description || '',
                cliente_id: proyecto.cliente_id?.toString() || '',
                status: proyecto.status,
            });
            setIsEditing(true);
        } else {
            setFormData({ id: null, name: '', description: '', cliente_id: '', status: 'En progreso' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
            };
            if (isEditing) {
                await axios.put(`/api/proyectos/${formData.id}`, payload);
            } else {
                await axios.post('/api/proyectos', payload);
            }
            await fetchProyectos();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving proyecto", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este proyecto? Se eliminarán también todas sus tareas.")) {
            try {
                await axios.delete(`/api/proyectos/${id}`);
                await fetchProyectos();
            } catch (error) {
                console.error("Error deleting proyecto", error);
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'En progreso':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'Completado':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'Pausado':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Gestión de Proyectos" 
            description="Administra y supervisa los proyectos de tu organización."
        >
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Directorio de Proyectos</h3>
                            <p className="text-xs text-slate-500">{proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} registrado{proyectos.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Proyecto
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="pb-3 px-4 font-semibold">Proyecto</th>
                                <th className="pb-3 px-4 font-semibold">Cliente</th>
                                <th className="pb-3 px-4 font-semibold">Estado</th>
                                <th className="pb-3 px-4 font-semibold">Tareas</th>
                                <th className="pb-3 px-4 font-semibold">Fecha</th>
                                <th className="pb-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            Cargando proyectos...
                                        </div>
                                    </td>
                                </tr>
                            ) : proyectos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                <Briefcase className="w-7 h-7 text-blue-600/60 dark:text-blue-400/60" />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400">No hay proyectos registrados.</p>
                                            <button onClick={() => handleOpenModal()} className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                                                + Crear tu primer proyecto
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                proyectos.map((proyecto) => (
                                    <tr key={proyecto.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shadow-inner">
                                                    {proyecto.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{proyecto.name}</p>
                                                    {proyecto.description && (
                                                        <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{proyecto.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-slate-600 dark:text-slate-300 text-sm">{proyecto.cliente_name}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(proyecto.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    proyecto.status === 'En progreso' ? 'bg-blue-500 dark:bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)] animate-pulse' :
                                                    proyecto.status === 'Completado' ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]' :
                                                    'bg-amber-500 dark:bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]'
                                                }`}></div>
                                                {proyecto.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300">
                                                {proyecto.tareas_count} tarea{proyecto.tareas_count !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-sm">{proyecto.date}</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(proyecto)} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(proyecto.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Eliminar">
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

            {/* Modal Crear/Editar Proyecto */}
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
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Proyecto <span className="text-rose-500">*</span></label>
                                    <input 
                                        required type="text" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                        placeholder="Ej. Migración Cloud"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                                    <textarea 
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors" 
                                        rows={3}
                                        placeholder="Describe brevemente el proyecto..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                                        <select 
                                            value={formData.cliente_id} onChange={e => setFormData({...formData, cliente_id: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            <option value="">Sin cliente</option>
                                            {clientes.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                                        <select 
                                            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            <option value="En progreso">En progreso</option>
                                            <option value="Completado">Completado</option>
                                            <option value="Pausado">Pausado</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/[0.05]">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50">
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
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
