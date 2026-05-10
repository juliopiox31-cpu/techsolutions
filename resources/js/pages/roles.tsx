import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2, Plus, Save, Check, ChevronRight, Info, Trash2, Edit3, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

interface Permission {
    id: string;
    label: string;
    desc: string;
}

interface PermissionGroup {
    id: string;
    title: string;
    permissions: Permission[];
}

export default function Roles() {
    const [roles, setRoles] = useState<any[]>([]);
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [activePermissions, setActivePermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [roleToEdit, setRoleToEdit] = useState<{name: string, index: number} | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<{name: string, index: number} | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/roles');
            setRoles(res.data.roles);
            setAllPermissions(res.data.all_permissions);
            
            // Set first role as selected if none selected
            if (res.data.roles.length > 0) {
                const adminRole = res.data.roles.find((r: any) => r.name === 'Administrador') || res.data.roles[0];
                setSelectedRole(adminRole);
                setActivePermissions(adminRole.permissions);
            }
        } catch (error) {
            console.error("Error fetching roles", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleSelect = (role: any) => {
        setSelectedRole(role);
        setActivePermissions(role.permissions);
    };

    const togglePermission = (permId: string) => {
        setActivePermissions(prev => 
            prev.includes(permId) 
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        try {
            await axios.put(`/api/roles/${selectedRole.id}`, {
                permissions: activePermissions
            });
            
            // Update local state
            setRoles(prev => prev.map(r => 
                r.id === selectedRole.id ? { ...r, permissions: activePermissions } : r
            ));
            
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving permissions", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddRole = async () => {
        if (!newRoleName.trim()) return;
        try {
            const res = await axios.post('/api/roles', { name: newRoleName });
            const newRole = { ...res.data.role, permissions: [] };
            setRoles([...roles, newRole]);
            handleRoleSelect(newRole);
            setNewRoleName('');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error creating role", error);
        }
    };

    const handleEditRole = async () => {
        if (!roleToEdit || !newRoleName.trim()) return;
        try {
            const roleId = roles[roleToEdit.index].id;
            await axios.put(`/api/roles/${roleId}`, { name: newRoleName });
            
            const updatedRoles = [...roles];
            updatedRoles[roleToEdit.index].name = newRoleName;
            setRoles(updatedRoles);
            
            if (selectedRole?.id === roleId) {
                setSelectedRole({ ...selectedRole, name: newRoleName });
            }
            
            setRoleToEdit(null);
            setNewRoleName('');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error editing role", error);
        }
    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            const roleId = roles[roleToDelete.index].id;
            await axios.delete(`/api/roles/${roleId}`);
            
            const updatedRoles = roles.filter((_, i) => i !== roleToDelete.index);
            setRoles(updatedRoles);
            
            if (selectedRole?.id === roleId) {
                const nextRole = updatedRoles[0] || null;
                setSelectedRole(nextRole);
                setActivePermissions(nextRole?.permissions || []);
            }
            
            setRoleToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting role", error);
            const err = error as any;
            if (err.response?.status === 403) {
                alert(err.response.data.error);
            }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const permissionGroups = allPermissions.reduce((acc: any[], perm: any) => {
        const group = acc.find(g => g.title === perm.group);
        if (group) {
            group.permissions.push(perm);
        } else {
            acc.push({ title: perm.group, permissions: [perm] });
        }
        return acc;
    }, []);

    if (isLoading) {
        return (
            <AdminLayout title="Cargando..." description="Sincronizando con la base de datos">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Roles y permisos" 
            description="Asigna capacidades por rol. Los cambios aplican a todos los usuarios con ese rol."
        >
            <div className="flex flex-col space-y-8 relative">
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Header Actions */}
                <div className="flex justify-end relative z-10">
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddModalOpen(true)}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-2xl text-sm font-bold text-white transition-all shadow-lg shadow-indigo-500/25"
                    >
                        <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        Nuevo rol
                    </motion.button>
                </div>

                {/* Main Content Split View */}
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={fadeUp}
                    className="grid grid-cols-1 lg:grid-cols-[300px_1fr] bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden min-h-[700px] shadow-xl dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative z-10 transition-colors duration-500"
                >
                    {/* Left Sidebar - Role List */}
                    <div className="border-r border-slate-100 dark:border-white/10 p-8 space-y-8 bg-slate-50 dark:bg-slate-950/20 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Roles del Sistema</h3>
                            </div>
                            
                            <div className="space-y-2">
                                {roles.map((role, idx) => (
                                    <div 
                                        key={role.id}
                                        className="group flex items-center gap-2"
                                    >
                                        <button
                                            onClick={() => handleRoleSelect(role)}
                                            className={`flex-1 flex items-center justify-between px-5 py-4 rounded-2xl transition-all relative overflow-hidden ${
                                                selectedRole?.id === role.id 
                                                    ? 'text-indigo-700 dark:text-indigo-400' 
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {selectedRole?.id === role.id && (
                                                <motion.div 
                                                    layoutId="activeRole"
                                                    className="absolute inset-0 bg-indigo-500/5 dark:bg-gradient-to-r dark:from-indigo-600/10 dark:to-transparent border border-indigo-200/50 dark:border-indigo-500/20"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className="text-sm font-bold relative z-10 truncate">{role.name}</span>
                                            {selectedRole?.id === role.id && (
                                                <ChevronRight className="w-4 h-4 relative z-10 text-indigo-600 dark:text-indigo-500" />
                                            )}
                                        </button>
                                        
                                        {/* Action buttons - only for non-admin roles */}
                                        {role.name !== 'Administrador' && (
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRoleToEdit({name: role.name, index: idx});
                                                        setNewRoleName(role.name);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-400/10 transition-colors"
                                                    title="Editar nombre"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRoleToDelete({name: role.name, index: idx});
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-colors"
                                                    title="Eliminar rol"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                            <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                                <div className="p-2 rounded-xl bg-indigo-500/10 h-fit">
                                    <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Los cambios de permisos se propagan automáticamente a todos los usuarios.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Permissions Panel */}
                    <div className="flex flex-col min-h-0 relative bg-white/50 dark:bg-white/[0.01] transition-colors duration-500">
                        {/* Panel Header */}
                        <div className="p-10 border-b border-slate-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{selectedRole?.name}</h2>
                                    {selectedRole?.name !== 'Administrador' && selectedRole && (
                                        <button 
                                            onClick={() => {
                                                const idx = roles.findIndex(r => r.id === selectedRole.id);
                                                setRoleToEdit({name: selectedRole.name, index: idx});
                                                setNewRoleName(selectedRole.name);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configura los niveles de acceso para este perfil.</p>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={isSaving || !selectedRole}
                                className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                    showSuccess 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                        : 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/15 disabled:opacity-50 shadow-sm'
                                }`}
                            >
                                <div className={`p-1 rounded-lg ${showSuccess ? 'bg-white/20' : 'bg-indigo-50 dark:bg-white/10'} transition-colors`}>
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-white" /> : showSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 text-indigo-600 dark:text-white" />}
                                </div>
                                {isSaving ? 'Aplicando cambios...' : showSuccess ? 'Configuración guardada' : 'Guardar configuración'}
                            </motion.button>
                        </div>

                        {/* Permissions Scrolling Area */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar transition-colors">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedRole?.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-16"
                                >
                                    {permissionGroups.map(group => (
                                        <div key={group.title} className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{group.title}</h3>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent" />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                                {group.permissions.map((perm: any) => {
                                                    const isEnabled = activePermissions.includes(perm.id);
                                                    return (
                                                        <motion.div 
                                                            key={perm.id}
                                                            whileHover={{ y: -4 }}
                                                            onClick={() => togglePermission(perm.id)}
                                                            className={`relative p-6 rounded-[2rem] border transition-all cursor-pointer group flex flex-col gap-4 ${
                                                                isEnabled 
                                                                    ? 'bg-indigo-50/50 dark:bg-indigo-600/5 border-indigo-200 dark:border-indigo-500/30 shadow-sm' 
                                                                    : 'bg-white dark:bg-transparent border-slate-100 dark:border-white/[0.06] hover:border-indigo-200 dark:hover:border-white/20 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                                                                    isEnabled 
                                                                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                                                                        : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 group-hover:border-slate-200 dark:group-hover:border-white/30 text-slate-400 dark:text-slate-500'
                                                                }`}>
                                                                    {isEnabled ? <Check className="w-6 h-6 stroke-[3]" /> : <Shield className="w-5 h-5 opacity-40" />}
                                                                </div>
                                                                
                                                                {/* Custom Checkbox Toggle */}
                                                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-indigo-600/30' : 'bg-slate-200 dark:bg-white/10'}`}>
                                                                    <motion.div 
                                                                        animate={{ x: isEnabled ? 20 : 4 }}
                                                                        className={`absolute top-1 w-3 h-3 rounded-full ${isEnabled ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-400 dark:bg-slate-500'}`}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className={`text-base font-bold mb-1.5 transition-colors ${isEnabled ? 'text-slate-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                                                    {perm.label}
                                                                </p>
                                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                                    {perm.desc}
                                                                </p>
                                                            </div>

                                                            {isEnabled && (
                                                                <motion.div 
                                                                    layoutId={`glow-${perm.id}`}
                                                                    className="absolute inset-0 rounded-[2rem] bg-indigo-600/5 blur-xl -z-10"
                                                                />
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden transition-colors duration-500"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient-x"></div>
                            
                            <div className="flex justify-between items-center mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                        {isAddModalOpen ? 'Crear Nuevo Perfil' : 'Modificar Identidad'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Define el nombre identificativo para este rol.</p>
                                </div>
                                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Etiqueta del Rol</label>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        placeholder="Ej. Gestor de Infraestructura"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:focus:ring-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        onKeyDown={(e) => e.key === 'Enter' && (isAddModalOpen ? handleAddRole() : handleEditRole())}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                        className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm font-bold"
                                    >
                                        Descartar
                                    </button>
                                    <button 
                                        onClick={isAddModalOpen ? handleAddRole : handleEditRole}
                                        className="flex-[1.5] px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
                                    >
                                        {isAddModalOpen ? 'Confirmar Creación' : 'Actualizar Nombre'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isDeleteModalOpen && roleToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl transition-colors duration-500"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
                                    <AlertTriangle className="w-10 h-10 text-rose-600" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">¿Eliminar Perfil?</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                                    Estás a punto de borrar permanentemente <span className="text-rose-600 dark:text-rose-400 font-bold">"{roleToDelete.name}"</span>. 
                                    Los usuarios vinculados perderán sus privilegios de forma inmediata.
                                </p>
                                <div className="w-full flex flex-col gap-3">
                                    <button 
                                        onClick={handleDeleteRole}
                                        className="w-full px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white transition-all text-sm font-bold shadow-lg shadow-rose-600/20"
                                    >
                                        Confirmar Eliminación
                                    </button>
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-sm font-bold"
                                    >
                                        Mantener Rol
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}} />
        </AdminLayout>
    );
}
