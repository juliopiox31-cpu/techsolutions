import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

export default function Usuarios() {
    const { auth } = usePage().props as any;
    // Redirect or show access denied if not admin, but assuming middleware/AdminLayout handles link visibility.
    // However, we should still protect the route contents:
    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'Administrador';

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', email: '', phone: '', role: '', status: 'Activo', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchUsuarios(), fetchRoles()]);
        };
        init();
    }, []);

    const fetchUsuarios = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error fetching usuarios", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await axios.get('/api/roles');
            setAvailableRoles(res.data.roles);
            // Set default role for new user if not editing
            if (!formData.role && res.data.roles.length > 0) {
                setFormData(prev => ({ ...prev, role: res.data.roles[0].name }));
            }
        } catch (error) {
            console.error("Error fetching roles", error);
        }
    };

    const handleOpenModal = (usuario: any = null) => {
        if (usuario) {
            setFormData({ ...usuario, password: '', phone: usuario.phone || '' });
            setIsEditing(true);
        } else {
            setFormData({ 
                id: null, 
                name: '', 
                email: '', 
                phone: '',
                role: availableRoles[0]?.name || 'Usuario', 
                status: 'Activo', 
                password: '' 
            });
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
                await axios.put(`/api/usuarios/${formData.id}`, formData);
            } else {
                await axios.post('/api/usuarios', formData);
            }
            await fetchUsuarios();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving usuario", error);
            const message = error.response?.data?.message || "Error al guardar el usuario. Verifica los datos (la contraseña debe tener al menos 8 caracteres).";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este usuario del sistema?")) {
            try {
                await axios.delete(`/api/usuarios/${id}`);
                await fetchUsuarios();
            } catch (error) {
                console.error("Error deleting usuario", error);
            }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Gestión de Usuarios" 
            description="Administra los usuarios del sistema y sus roles."
        >
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Lista de Usuarios</h3>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Usuario
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <th className="pb-3 px-4 font-semibold">Usuario</th>
                                <th className="pb-3 px-4 font-semibold">Rol</th>
                                <th className="pb-3 px-4 font-semibold">Estado</th>
                                <th className="pb-3 px-4 font-semibold">Fecha Registro</th>
                                <th className="pb-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                            Cargando usuarios...
                                        </div>
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">No hay usuarios registrados.</td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-white shadow-inner">
                                                    {usuario.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{usuario.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{usuario.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                                            <span className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] px-2 py-1 rounded text-xs font-medium">
                                                {usuario.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                usuario.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                                usuario.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                            }`}>
                                                {usuario.status === 'Activo' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5 shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse"></div>}
                                                {usuario.status === 'Pendiente' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mr-1.5 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>}
                                                {usuario.status === 'Inactivo' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mr-1.5 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>}
                                                {usuario.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{usuario.date}</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(usuario)} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(usuario.id)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Eliminar">
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

            {/* Modal Crear/Editar Usuario */}
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
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo <span className="text-rose-500">*</span></label>
                                    <input 
                                        required type="text" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico <span className="text-rose-500">*</span></label>
                                        <input 
                                            required type="email" 
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                            placeholder="Ej. +1 234 567 890"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Contraseña {!isEditing && <span className="text-rose-500">*</span>}
                                        {isEditing && <span className="text-[10px] text-slate-500 ml-2">(Dejar en blanco para mantener actual)</span>}
                                    </label>
                                    <input 
                                        required={!isEditing} 
                                        type="password" 
                                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                        placeholder={isEditing ? "••••••••" : "Mínimo 8 caracteres"}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                                        <select 
                                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            {availableRoles.map(role => (
                                                <option key={role.id} value={role.name}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                                        <select 
                                            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/[0.05]">
                                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50">
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
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
