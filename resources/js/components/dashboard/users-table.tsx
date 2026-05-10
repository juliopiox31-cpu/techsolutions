import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    date: string;
}

interface UsersTableProps {
    users: User[];
    isLoading?: boolean;
}

export default function UsersTable({ users, isLoading = false }: UsersTableProps) {
    if (isLoading) {
        return (
            <div className="p-6 rounded-3xl bg-[#111827]/80 backdrop-blur-md border border-white/[0.08]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="w-40 h-6 bg-white/[0.05] rounded mb-2 animate-pulse"></div>
                        <div className="w-48 h-4 bg-white/[0.05] rounded animate-pulse"></div>
                    </div>
                    <div className="w-24 h-10 bg-white/[0.05] rounded-lg animate-pulse"></div>
                </div>
                <div className="w-full h-64 bg-white/[0.02] rounded-lg animate-pulse"></div>
            </div>
        );
    }

    const handleExport = () => {
        if (!users || users.length === 0) return;

        const headers = ['Nombre', 'Correo', 'Número de Teléfono', 'Rol'];
        const csvRows = [headers.join(';')];

        for (const user of users) {
            const row = [
                `"${user.name}"`,
                `"${user.email}"`,
                `"${user.phone || 'N/A'}"`,
                `"${user.role}"`
            ];
            csvRows.push(row.join(';'));
        }

        const csvString = csvRows.join('\n');
        // Add BOM \uFEFF to fix UTF-8 encoding in Excel
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'usuarios_recientes.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none transition-colors duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Usuarios Recientes</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Nuevas altas en la plataforma empresarial</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                    Exportar CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="pb-3 px-4 font-semibold">Usuario</th>
                            <th className="pb-3 px-4 font-semibold">Rol</th>
                            <th className="pb-3 px-4 font-semibold">Estado</th>
                            <th className="pb-3 px-4 font-semibold text-right">Fecha de Registro</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-white shadow-inner">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{user.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                                    <span className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] px-2 py-1 rounded text-xs font-medium">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                        user.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                                        user.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 
                                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    }`}>
                                        {user.status === 'Activo' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5 shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse"></div>}
                                        {user.status === 'Pendiente' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mr-1.5 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>}
                                        {user.status === 'Inactivo' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mr-1.5 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right text-slate-500 dark:text-slate-400 font-medium">{user.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
