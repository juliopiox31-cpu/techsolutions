import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

export default function Clientes() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', email: '', phone: '', company: '', status: 'Activo', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/clientes');
            setClientes(res.data);
        } catch (error) {
            console.error("Error fetching clientes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (cliente: any = null) => {
        if (cliente) {
            setFormData(cliente);
            setIsEditing(true);
        } else {
            setFormData({ id: null, name: '', email: '', phone: '', company: '', status: 'Activo', password: '' });
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
            if (isEditing) {
                await axios.put(`/api/mobile/clientes/${formData.id}`, formData);
            } else {
                await axios.post('/api/mobile/clientes', formData);
            }
            await fetchClientes();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving cliente", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este cliente?")) {
            try {
                axios.delete(`/api/mobile/clientes/${id}`)
                await fetchClientes();
            } catch (error) {
                console.error("Error deleting cliente", error);
            }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout
            title="Gestión de Clientes"
            description="Administra la base de clientes del sistema."
        >
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Directorio de Clientes</h3>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Cliente
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="pb-3 px-4 font-semibold">Cliente</th>
                                <th className="pb-3 px-4 font-semibold">Empresa</th>
                                <th className="pb-3 px-4 font-semibold">Contacto</th>
                                <th className="pb-3 px-4 font-semibold">Estado</th>
                                <th className="pb-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            Cargando clientes...
                                        </div>
                                    </td>
                                </tr>
                            ) : clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">No hay clientes registrados.</td>
                                </tr>
                            ) : (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{cliente.name}</p>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{cliente.company}</td>
                                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                                            <p className="text-xs">{cliente.email}</p>
                                            <p className="text-xs">{cliente.phone}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cliente.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                }`}>
                                                {cliente.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" title="Ver">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleOpenModal(cliente)} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(cliente.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Eliminar">
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

            {/* Modal Crear/Editar Cliente */}
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
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo <span className="text-rose-500">*</span></label>
                                    <input
                                        required type="text"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Empresa</label>
                                    <input
                                        type="text"
                                        value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Ej. Acme Corp"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                                        <input
                                            type="text"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="+52 555..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Contraseña {isEditing && <span className="text-xs text-slate-500 font-normal">(Dejar en blanco para no cambiar)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                                    <select
                                        value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/[0.05]">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50">
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
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
