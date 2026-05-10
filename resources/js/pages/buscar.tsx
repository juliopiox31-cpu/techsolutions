import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { motion } from 'framer-motion';
import { 
    Search, Briefcase, CheckSquare, Users, User, 
    ChevronRight, ArrowLeft, SearchX 
} from 'lucide-react';

interface Props {
    results: {
        projects: any[];
        tasks: any[];
        clients: any[];
        users: any[];
    };
    query: string;
}

export default function Buscar({ results, query }: Props) {
    const totalResults = results.projects.length + results.tasks.length + results.clients.length + results.users.length;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <AdminLayout 
            title={`Búsqueda: ${query}`}
            description={totalResults > 0 ? `Se han encontrado ${totalResults} resultados para "${query}"` : `No se encontraron resultados para "${query}"`}
        >
            <Head title={`Buscando: ${query}`} />

            <div className="space-y-8">
                {totalResults === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="p-6 rounded-full bg-slate-800/50 border border-white/10 mb-6">
                            <SearchX className="w-16 h-16 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Sin resultados</h2>
                        <p className="text-slate-400 max-w-md">
                            No pudimos encontrar nada que coincida con "{query}". Intenta buscar algo diferente o revisa la ortografía.
                        </p>
                        <Link 
                            href="/dashboard"
                            className="mt-8 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Dashboard
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-8"
                    >
                        {/* Projects Section */}
                        {results.projects.length > 0 && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Proyectos ({results.projects.length})</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.projects.map((project) => (
                                        <motion.div key={project.id} variants={item}>
                                            <Link href="/proyectos" className="block group">
                                                <div className="p-5 rounded-2xl bg-[#111827]/60 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/50 transition-all shadow-xl">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{project.name}</h4>
                                                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black ${
                                                            project.status === 'Completado' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            project.status === 'En progreso' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{project.description}</p>
                                                    <div className="flex items-center text-blue-400 text-xs font-bold gap-1">
                                                        Ver detalles <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tasks Section */}
                        {results.tasks.length > 0 && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Tareas ({results.tasks.length})</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.tasks.map((task) => (
                                        <motion.div key={task.id} variants={item}>
                                            <Link href="/tareas" className="block group">
                                                <div className="p-5 rounded-2xl bg-[#111827]/60 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/50 transition-all shadow-xl">
                                                    <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors mb-2">{task.title}</h4>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{task.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black ${
                                                            task.status === 'Completada' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            task.status === 'En progreso' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                        <div className="flex items-center text-emerald-400 text-xs font-bold gap-1">
                                                            Gestionar <ChevronRight className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Clients Section */}
                        {results.clients.length > 0 && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <Users className="w-5 h-5 text-sky-400" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Clientes ({results.clients.length})</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.clients.map((client) => (
                                        <motion.div key={client.id} variants={item}>
                                            <Link href="/clientes" className="block group">
                                                <div className="p-5 rounded-2xl bg-[#111827]/60 backdrop-blur-xl border border-white/[0.08] hover:border-sky-500/50 transition-all shadow-xl">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 text-xl font-bold">
                                                            {client.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold group-hover:text-sky-400 transition-colors">{client.name}</h4>
                                                            <p className="text-xs text-slate-500">{client.empresa}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 truncate mb-4">{client.email}</p>
                                                    <div className="flex items-center text-sky-400 text-xs font-bold gap-1">
                                                        Expediente <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Users Section */}
                        {results.users.length > 0 && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <User className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Usuarios ({results.users.length})</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.users.map((user) => (
                                        <motion.div key={user.id} variants={item}>
                                            <Link href="/usuarios" className="block group">
                                                <div className="p-5 rounded-2xl bg-[#111827]/60 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/50 transition-all shadow-xl">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold border-2 border-[#111827]">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold group-hover:text-purple-400 transition-colors">{user.name}</h4>
                                                            <span className="text-[10px] text-purple-400 uppercase font-black">{user.role}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 truncate mb-4">{user.email}</p>
                                                    <div className="flex items-center text-purple-400 text-xs font-bold gap-1">
                                                        Perfil de Usuario <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
}
