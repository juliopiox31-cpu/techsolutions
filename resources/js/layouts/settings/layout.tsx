import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import AdminLayout from '@/layouts/admin-layout';
import { User, Shield, Palette, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarNavItems = [
    {
        title: 'Perfil',
        href: edit().url,
        icon: User,
        desc: 'Tu información personal'
    },
    {
        title: 'Seguridad',
        href: editSecurity().url,
        icon: Shield,
        desc: 'Contraseña y protección'
    },
    {
        title: 'Apariencia',
        href: editAppearance().url,
        icon: Palette,
        desc: 'Personaliza tu interfaz'
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AdminLayout 
            title="Ajustes del Sistema" 
            description="Gestiona tu perfil, seguridad y preferencias de visualización."
        >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
                {/* Decoration */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
                
                {/* Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <nav className="space-y-2 sticky top-8">
                        <div className="px-4 mb-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Configuración</h3>
                        </div>
                        {sidebarNavItems.map((item) => {
                            const isActive = isCurrentOrParentUrl(item.href);
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                        isActive 
                                            ? "bg-blue-600/10 dark:bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-white shadow-lg dark:shadow-xl shadow-blue-900/5 dark:shadow-blue-900/10" 
                                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-100 hover:bg-blue-50 dark:hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeSetting"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 dark:from-blue-600/5 dark:to-cyan-600/5"
                                        />
                                    )}
                                    <div className={cn(
                                        "p-2 rounded-xl transition-all",
                                        isActive ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    )}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 relative z-10">
                                        <p className="text-sm font-bold truncate">{item.title}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-500 truncate group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">{item.desc}</p>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-500" />}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-[2.5rem] p-8 lg:p-12 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
