import React, { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Activity, Settings, LogOut,
    Bell, Search, Menu, ChevronRight, Briefcase, CheckSquare, Shield, User, MessageSquare
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppLogo from '@/components/app-logo';
import axios from 'axios';
import { toast } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

interface SearchResult {
    id: string;
    title: string;
    type: 'Proyecto' | 'Tarea' | 'Usuario' | 'Cliente';
    href: string;
}

interface Notification {
    title: string;
    desc: string;
    time: string;
    unread: boolean;
    type: string;
}

export default function AdminLayout({ children, title = "TechSolutions", description }: AdminLayoutProps) {
    const { auth, url } = usePage().props as any;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { appearance, resolvedAppearance } = useAppearance();
    
    // UI States
    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
    const [liveResults, setLiveResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Notifications Logic
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications', {
                    params: { _t: Date.now() },
                    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
                });
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter((n: any) => n.unread).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        // Welcome Toast
        const hasWelcomed = sessionStorage.getItem('hasWelcomed');
        if (!hasWelcomed && auth.user) {
            toast.success(`¡Bienvenido de nuevo, ${auth.user.name}!`, {
                description: 'Estamos listos para seguir impulsando tus proyectos.',
                duration: 5000,
            });
            sessionStorage.setItem('hasWelcomed', 'true');
        }
    }, []);

    // Live Search Logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const response = await axios.get(`/api/search?q=${searchQuery}`);
                    setLiveResults(response.data.results);
                } catch (error) {
                    console.error("Live search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setLiveResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const userRole = auth?.user?.role?.toLowerCase() || '';
    const isAdmin = userRole === 'admin' || userRole === 'administrador';
    const permissions = auth?.user?.permissions || [];

    const hasPermission = (perm: string) => {
        if (isAdmin) return true;
        return permissions.includes(perm);
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/buscar', { q: searchQuery });
        }
    };

    const handleLogout = (e: MouseEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);
        router.post('/logout');
    };

    const getPageName = () => {
        if (url === '/dashboard') return 'Panel de Control';
        if (url?.startsWith('/proyectos')) return 'Proyectos';
        if (url?.startsWith('/tareas')) return 'Tareas';
        if (url?.startsWith('/clientes')) return 'Clientes';
        if (url?.startsWith('/usuarios')) return 'Usuarios';
        if (url?.startsWith('/roles')) return 'Roles y Permisos';
        if (url?.startsWith('/reportes')) return 'Reportes';
        if (url?.startsWith('/settings')) return 'Ajustes del Sistema';
        if (url?.startsWith('/actividad')) return 'Actividad Reciente';
        return 'Panel de Control';
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="h-[100dvh] bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 flex overflow-hidden selection:bg-cyan-500/30 font-sans transition-colors duration-500">
            <Head title={title} />

            {/* --- SIDEBAR --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#111827]/90 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Brand */}
                <div className="h-20 flex items-center px-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <AppLogo />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Principal</div>

                    <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url === '/dashboard' ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                        {url === '/dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                        <LayoutDashboard className={`w-5 h-5 ${url === '/dashboard' ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors'}`} />
                        Dashboard
                    </Link>

                    {auth.user.role !== 'Cliente' && (
                        <>
                            {hasPermission('module_clientes') && (
                                <Link href="/clientes" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/clientes') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/clientes') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <Users className={`w-5 h-5 ${url?.startsWith('/clientes') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors'}`} />
                                    Clientes
                                </Link>
                            )}

                            {hasPermission('module_proyectos') && (
                                <Link href="/proyectos" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/proyectos') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/proyectos') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <Briefcase className={`w-5 h-5 ${url?.startsWith('/proyectos') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'}`} />
                                    Proyectos
                                </Link>
                            )}
                            
                            {hasPermission('module_tareas') && (
                                <Link href="/tareas" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/tareas') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/tareas') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <CheckSquare className={`w-5 h-5 ${url?.startsWith('/tareas') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors'}`} />
                                    Tareas
                                </Link>
                            )}

                            {isAdmin && (
                                <Link href="/asignaciones" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/asignaciones') ? 'bg-orange-500/10 dark:bg-gradient-to-r dark:from-orange-600/20 dark:to-amber-600/10 text-orange-600 dark:text-amber-400 border border-orange-500/20 dark:border-amber-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-slate-100 hover:bg-orange-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/asignaciones') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-600 dark:bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)] dark:shadow-[0_0_10px_#fbbf24]"></div>}
                                    <Users className={`w-5 h-5 ${url?.startsWith('/asignaciones') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors'}`} />
                                    Asignaciones
                                </Link>
                            )}

                            <Link href="/mensajes" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/mensajes') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                {url?.startsWith('/mensajes') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                <MessageSquare className={`w-5 h-5 ${url?.startsWith('/mensajes') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors'}`} />
                                Bandeja
                            </Link>

                            {hasPermission('manage_users') && (
                                <Link href="/usuarios" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/usuarios') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/usuarios') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <Users className={`w-5 h-5 ${url?.startsWith('/usuarios') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors'}`} />
                                    Usuarios
                                </Link>
                            )}

                            {hasPermission('manage_roles') && (
                                <Link href="/roles" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/roles') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/roles') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <Shield className={`w-5 h-5 ${url?.startsWith('/roles') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors'}`} />
                                    Roles
                                </Link>
                            )}

                            {hasPermission('module_reportes') && (
                                <Link href="/reportes" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/reportes') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                    {url?.startsWith('/reportes') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                    <Activity className={`w-5 h-5 ${url?.startsWith('/reportes') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors'}`} />
                                    Reportes
                                </Link>
                            )}
                        </>
                    )}

                    {hasPermission('module_settings') && (
                        <>
                            <div className="mt-8 mb-4 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Configuración</div>

                            <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group relative ${url?.startsWith('/settings') ? 'bg-blue-600/10 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-cyan-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-500/20 shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5'}`}>
                                {url?.startsWith('/settings') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)] dark:shadow-[0_0_10px_#22d3ee]"></div>}
                                <Settings className={`w-5 h-5 ${url?.startsWith('/settings') ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors'}`} />
                                Ajustes del Sistema
                            </Link>
                        </>
                    )}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0F172A]/50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-inner ring-2 ring-white dark:ring-[#0B1120]">
                            {auth?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{auth?.user?.name || 'Usuario'}</p>
                            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate uppercase font-semibold">{auth?.user?.role || 'Miembro'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 font-medium transition-colors border border-transparent hover:border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoggingOut ? (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                    </button>
                </div>
            </motion.aside>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 dark:from-blue-900/10 via-white dark:via-[#0B1120] to-white dark:to-[#0B1120] transition-colors duration-500">
                
                {/* Topbar */}
                <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0B1120]/50 backdrop-blur-xl z-30 relative">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400">
                            <span className="bg-white/[0.05] px-2 py-1 rounded">
                                {auth?.user?.role === 'Cliente' ? 'Cliente' : 'Admin'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-slate-200">
                                {auth?.user?.role === 'Cliente' && url === '/dashboard' ? 'Mi Dashboard' : getPageName()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        {auth?.user?.role !== 'Cliente' && (
                            <div className="hidden md:block relative group">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar proyectos, tareas..."
                                        className="w-64 h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] text-sm text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all shadow-inner"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </form>

                                {/* Live Results Dropdown */}
                                <AnimatePresence>
                                    {liveResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-2xl rounded-2xl z-50 overflow-hidden transition-colors"
                                        >
                                            <div className="p-3 border-b border-slate-100 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0B1120]/50">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Sugerencias rápidas</p>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {liveResults.map((res) => (
                                                    <Link
                                                        key={res.id}
                                                        href={res.href}
                                                        onClick={() => setLiveResults([])}
                                                        className="flex items-center gap-3 p-3 border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                            {res.type === 'Proyecto' ? <Briefcase className="w-4 h-4" /> : 
                                                             res.type === 'Tarea' ? <CheckSquare className="w-4 h-4" /> : 
                                                             <User className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-white">{res.title}</p>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold">{res.type}</p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-500" />
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0B1120]/50">
                                                <button 
                                                    onClick={handleSearch}
                                                    className="w-full py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                                                >
                                                    Ver todos los resultados
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                                className="relative p-2 rounded-full border border-slate-200 dark:border-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-[#0B1120] shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-[min(320px,calc(100vw-1rem))] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-2xl rounded-2xl z-50 overflow-hidden transition-colors"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-white/[0.05] flex justify-between items-center bg-slate-50 dark:bg-[#0B1120]/50">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">Notificaciones</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-medium">{unreadCount} nuevas</span>
                                                )}
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif, i) => (
                                                        <div key={i} className={`p-4 border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer ${notif.unread ? 'bg-blue-500/[0.03] dark:bg-blue-500/5' : ''}`}>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className={`text-sm ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{notif.title}</h4>
                                                                {notif.unread && <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mt-1.5"></span>}
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{notif.desc}</p>
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{notif.time}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-slate-500 dark:text-slate-500 text-sm italic">
                                                        No tienes notificaciones pendientes.
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0B1120]/50">
                                                <button 
                                                    onClick={() => {
                                                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                                                        setUnreadCount(0);
                                                    }}
                                                    className="w-full py-2 text-sm text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-medium transition-colors"
                                                >
                                                    Marcar todas como leídas
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8 pb-12 relative z-10">
                        {title && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                                        {title}
                                    </h1>
                                    {description && (
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
