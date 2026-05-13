import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, User } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { AuditInfoBlock, type AuditUserRef } from '@/components/audit-info-block';

interface TareaShow {
    id: number;
    title: string;
    description: string | null;
    status: string;
    proyecto: { id: number; name: string } | null;
    assignee: { id: number; name: string } | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: AuditUserRef;
    updated_by: AuditUserRef;
}

function statusBadge(status: string) {
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
}

export default function TareasShow() {
    const { tarea } = usePage().props as unknown as { tarea: TareaShow };

    return (
        <AdminLayout title="Detalle de la tarea" description="Asignación, proyecto e historial de cambios.">
            <Head title={`Tarea: ${tarea.title}`} />
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-6 p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none"
            >
                <Link
                    href="/tareas"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a tareas
                </Link>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{tarea.title}</h1>
                        <span className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(tarea.status)}`}>
                            {tarea.status}
                        </span>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 dark:border-white/[0.06] p-4">
                        <p className="text-xs uppercase text-slate-500 font-medium mb-1">Proyecto</p>
                        <p className="text-slate-800 dark:text-slate-200">{tarea.proyecto?.name ?? '—'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-100 dark:border-white/[0.06] p-4 flex items-start gap-3">
                        <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs uppercase text-slate-500 font-medium mb-1">Asignado a</p>
                            <p className="text-slate-800 dark:text-slate-200">{tarea.assignee?.name ?? 'Sin asignar'}</p>
                        </div>
                    </div>
                </div>

                {tarea.description && (
                    <div className="rounded-lg border border-slate-100 dark:border-white/[0.06] p-4">
                        <p className="text-xs uppercase text-slate-500 font-medium mb-2">Descripción</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{tarea.description}</p>
                    </div>
                )}

                <AuditInfoBlock
                    createdAt={tarea.created_at}
                    updatedAt={tarea.updated_at}
                    createdBy={tarea.created_by}
                    updatedBy={tarea.updated_by}
                />
            </motion.div>
        </AdminLayout>
    );
}
