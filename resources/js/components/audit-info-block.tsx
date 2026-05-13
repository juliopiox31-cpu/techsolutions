import React from 'react';
import { History } from 'lucide-react';

export type AuditUserRef = { id: number; name: string } | null;

export interface AuditInfoBlockProps {
    createdAt: string | null;
    updatedAt: string | null;
    createdBy: AuditUserRef;
    updatedBy: AuditUserRef;
}

export function AuditInfoBlock({ createdAt, updatedAt, createdBy, updatedBy }: AuditInfoBlockProps) {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0B1120]/50 p-5">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold text-sm">
                <History className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                Registro de auditoría
            </div>
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                    <dt className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide mb-1">Creación</dt>
                    <dd className="text-slate-800 dark:text-slate-200">{createdAt ?? '—'}</dd>
                    <dd className="text-slate-600 dark:text-slate-400 mt-1">
                        {createdBy ? <>Por <span className="font-medium text-slate-700 dark:text-slate-300">{createdBy.name}</span></> : 'Usuario no registrado'}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide mb-1">Última edición</dt>
                    <dd className="text-slate-800 dark:text-slate-200">{updatedAt ?? '—'}</dd>
                    <dd className="text-slate-600 dark:text-slate-400 mt-1">
                        {updatedBy ? <>Por <span className="font-medium text-slate-700 dark:text-slate-300">{updatedBy.name}</span></> : 'Usuario no registrado'}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
