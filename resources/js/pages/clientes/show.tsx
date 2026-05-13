import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Mail, Phone } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { AuditInfoBlock, type AuditUserRef } from '@/components/audit-info-block';

interface ClienteShow {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    created_by: AuditUserRef;
    updated_by: AuditUserRef;
}

export default function ClientesShow() {
    const { cliente } = usePage().props as unknown as { cliente: ClienteShow };

    return (
        <AdminLayout title="Detalle del cliente" description="Información del contacto y trazabilidad de cambios.">
            <Head title={`Cliente: ${cliente.name}`} />
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-6 p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none"
            >
                <Link
                    href="/clientes"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al directorio
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{cliente.name}</h1>
                    <span
                        className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                            cliente.status === 'Activo'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                    >
                        {cliente.status}
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-white/[0.06] p-4">
                        <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs uppercase text-slate-500 font-medium">Empresa</p>
                            <p className="text-slate-800 dark:text-slate-200">{cliente.company || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-white/[0.06] p-4">
                        <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs uppercase text-slate-500 font-medium">Correo</p>
                            <p className="text-slate-800 dark:text-slate-200 break-all">{cliente.email || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-white/[0.06] p-4 sm:col-span-2">
                        <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs uppercase text-slate-500 font-medium">Teléfono</p>
                            <p className="text-slate-800 dark:text-slate-200">{cliente.phone || '—'}</p>
                        </div>
                    </div>
                </div>

                <AuditInfoBlock
                    createdAt={cliente.created_at}
                    updatedAt={cliente.updated_at}
                    createdBy={cliente.created_by}
                    updatedBy={cliente.updated_by}
                />
            </motion.div>
        </AdminLayout>
    );
}
