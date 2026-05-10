import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, PieChart, Loader2, Users, Briefcase, CheckSquare, UserCheck, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RPieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import axios from 'axios';
import AdminLayout from '@/layouts/admin-layout';

interface ReportData {
    summary: { total_proyectos: number; total_tareas: number; total_clientes: number; total_usuarios: number };
    tareas_dist: { completadas: number; en_progreso: number; pendientes: number; total: number };
    proyectos_dist: { en_progreso: number; completados: number; pausados: number };
    monthly: { name: string; proyectos: number; tareas: number }[];
    proyectos: { id: number; name: string; description: string; status: string; cliente_name: string; tareas_total: number; tareas_completadas: number; date: string }[];
}

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function Reportes() {
    const [data, setData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/reportes');
            setData(res.data);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const filteredProyectos = data?.proyectos?.filter(p => {
        if (filter === 'active') return p.status === 'En progreso';
        if (filter === 'completed') return p.status === 'Completado';
        return true;
    }) ?? [];

    const tareasPieData = data ? [
        { name: 'Completadas', value: data.tareas_dist.completadas },
        { name: 'En progreso', value: data.tareas_dist.en_progreso },
        { name: 'Pendientes', value: data.tareas_dist.pendientes },
    ].filter(d => d.value > 0) : [];

    const proyectosBarData = data ? [
        { name: 'En progreso', value: data.proyectos_dist.en_progreso },
        { name: 'Completados', value: data.proyectos_dist.completados },
        { name: 'Pausados', value: data.proyectos_dist.pausados },
    ] : [];

    const handleExportPDF = async () => {
        if (!data) return;
        setIsExporting(true);
        const filterLabel = filter === 'all' ? 'Todos los Proyectos' : filter === 'active' ? 'Proyectos En Progreso' : 'Proyectos Completados';
        const filterFilename = filter === 'all' ? 'todos' : filter === 'active' ? 'en_progreso' : 'completados';
        try {
            const { default: jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;
            const doc = new jsPDF('landscape', 'mm', 'a4');
            const w = doc.internal.pageSize.getWidth();

            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, w, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text(`TechSolutions — ${filterLabel}`, 14, 18);
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`Generado el ${new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}`, 14, 28);
            doc.text(`${filteredProyectos.length} proyecto${filteredProyectos.length !== 1 ? 's' : ''} encontrado${filteredProyectos.length !== 1 ? 's' : ''}`, 14, 34);

            // Summary boxes
            const summaryY = 48;
            const boxW = (w - 70) / 4;
            const summaryItems = [
                { label: 'Proyectos', value: data.summary.total_proyectos },
                { label: 'Tareas', value: data.summary.total_tareas },
                { label: 'Clientes', value: data.summary.total_clientes },
                { label: 'Usuarios', value: data.summary.total_usuarios },
            ];
            summaryItems.forEach((item, i) => {
                const x = 14 + i * (boxW + 14);
                doc.setFillColor(30, 41, 59);
                doc.roundedRect(x, summaryY, boxW, 22, 3, 3, 'F');
                doc.setTextColor(148, 163, 184);
                doc.setFontSize(9);
                doc.text(item.label, x + 6, summaryY + 9);
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.text(String(item.value), x + 6, summaryY + 18);
            });

            // Projects table
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.text(`Detalle — ${filterLabel}`, 14, summaryY + 36);

            autoTable(doc, {
                startY: summaryY + 40,
                head: [['#', 'Proyecto', 'Cliente', 'Estado', 'Tareas', 'Completadas', 'Fecha']],
                body: filteredProyectos.map((p, i) => [
                    i + 1, p.name, p.cliente_name, p.status,
                    p.tareas_total, p.tareas_completadas, p.date
                ]),
                theme: 'grid',
                styles: { fillColor: [17, 24, 39], textColor: [226, 232, 240], lineColor: [51, 65, 85], lineWidth: 0.3, fontSize: 9 },
                headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
                alternateRowStyles: { fillColor: [22, 33, 52] },
            });

            // Task distribution summary on last page
            const finalY = (doc as any).lastAutoTable?.finalY ?? 160;
            if (finalY > 160) doc.addPage();
            const distY = finalY > 160 ? 20 : finalY + 12;
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.text('Distribución de Tareas', 14, distY);
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`Completadas: ${data.tareas_dist.completadas}  |  En progreso: ${data.tareas_dist.en_progreso}  |  Pendientes: ${data.tareas_dist.pendientes}  |  Total: ${data.tareas_dist.total}`, 14, distY + 8);

            doc.save(`reporte_${filterFilename}_techsolutions.pdf`);
        } catch (e) { console.error('PDF export error', e); }
        finally { setIsExporting(false); }
    };

    const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    const statCards = data ? [
        { label: 'Proyectos', value: data.summary.total_proyectos, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Tareas', value: data.summary.total_tareas, icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Clientes', value: data.summary.total_clientes, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Usuarios', value: data.summary.total_usuarios, icon: UserCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    ] : [];

    return (
        <AdminLayout title="Centro de Reportes" description="Genera y visualiza reportes detallados del rendimiento del sistema y del equipo.">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] p-4 rounded-2xl relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                    <div className="flex items-center gap-3">
                        <select 
                            value={filter} 
                            onChange={e => setFilter(e.target.value)} 
                            className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors [&>option]:bg-white dark:[&>option]:bg-[#111827] [&>option]:text-slate-900 dark:[&>option]:text-white"
                        >
                            <option value="all">Todos los proyectos</option>
                            <option value="active">En progreso</option>
                            <option value="completed">Completados</option>
                        </select>
                    </div>
                    <button onClick={handleExportPDF} disabled={isExporting || isLoading || !data} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50">
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Generando...' : 'Exportar a PDF'}
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20 gap-3 text-slate-500 dark:text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        Cargando datos del reporte...
                    </div>
                ) : data && (
                    <>
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                            {statCards.map(s => (
                                <div key={s.label} className="p-5 rounded-2xl bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/30 transition-all shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-xl ${s.bg} border ${s.border}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{s.label} totales</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                            {/* Area chart - monthly */}
                            <div className="bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-500">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-blue-500/5 blur-[50px] pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-6 relative z-10">
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Actividad Mensual</h3>
                                </div>
                                <div className="h-72 relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="cP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                                                <linearGradient id="cT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/><stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/></linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false}/>
                                            <XAxis dataKey="name" stroke="rgba(148,163,184,0.3)" tick={{fill:'#94A3B8',fontSize:12}} axisLine={false} tickLine={false}/>
                                            <YAxis stroke="rgba(148,163,184,0.3)" tick={{fill:'#94A3B8',fontSize:12}} axisLine={false} tickLine={false} allowDecimals={false}/>
                                            <Tooltip 
                                                contentStyle={{backgroundColor:'rgba(255,255,255,0.95)', border:'1px solid rgba(148,163,184,0.2)', borderRadius:'12px', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                                                itemStyle={{fontSize:'13px'}} 
                                                labelStyle={{color:'#64748b', fontSize:'12px', fontWeight:'bold'}}
                                                cursor={{stroke: '#3b82f6', strokeWidth: 2}}
                                            />
                                            <Area type="monotone" dataKey="proyectos" name="Proyectos" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#cP)" activeDot={{r:6,strokeWidth:0,fill:'#3B82F6'}}/>
                                            <Area type="monotone" dataKey="tareas" name="Tareas" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#cT)" activeDot={{r:6,strokeWidth:0,fill:'#38BDF8'}}/>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie chart - task distribution */}
                            <div className="bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl flex flex-col shadow-sm dark:shadow-none transition-colors duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Distribución de Tareas</h3>
                                </div>
                                <div className="flex-1 min-h-[280px]">
                                    {tareasPieData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">No hay tareas registradas</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RPieChart>
                                                <Pie data={tareasPieData} cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                                                    {tareasPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{backgroundColor:'rgba(255,255,255,0.95)', border:'1px solid rgba(148,163,184,0.2)', borderRadius:'12px', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                                                />
                                                <Legend verticalAlign="bottom" iconType="circle" formatter={(v:string) => <span className="text-slate-600 dark:text-slate-400 text-sm ml-1">{v}</span>}/>
                                            </RPieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bar chart - projects by status */}
                        <div className="bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Proyectos por Estado</h3>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={proyectosBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false}/>
                                        <XAxis dataKey="name" tick={{fill:'#94A3B8',fontSize:12}} axisLine={false} tickLine={false}/>
                                        <YAxis tick={{fill:'#94A3B8',fontSize:12}} axisLine={false} tickLine={false} allowDecimals={false}/>
                                        <Tooltip 
                                            contentStyle={{backgroundColor:'rgba(255,255,255,0.95)', border:'1px solid rgba(148,163,184,0.2)', borderRadius:'12px', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                                            cursor={{fill:'rgba(148,163,184,0.05)'}}
                                        />
                                        <Bar dataKey="value" name="Proyectos" radius={[8,8,0,0]}>
                                            {proyectosBarData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]}/>)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Projects table */}
                        <div className="bg-white dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl relative z-10 shadow-sm dark:shadow-none transition-colors duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Detalle de Proyectos</h3>
                                </div>
                                <span className="text-xs text-slate-500">{filteredProyectos.length} proyecto{filteredProyectos.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            <th className="pb-3 px-4 font-semibold">#</th>
                                            <th className="pb-3 px-4 font-semibold">Proyecto</th>
                                            <th className="pb-3 px-4 font-semibold">Cliente</th>
                                            <th className="pb-3 px-4 font-semibold">Estado</th>
                                            <th className="pb-3 px-4 font-semibold">Tareas</th>
                                            <th className="pb-3 px-4 font-semibold">Progreso</th>
                                            <th className="pb-3 px-4 font-semibold">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {filteredProyectos.length === 0 ? (
                                            <tr><td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">No hay proyectos con este filtro.</td></tr>
                                        ) : filteredProyectos.map((p, i) => {
                                            const pct = p.tareas_total > 0 ? Math.round((p.tareas_completadas / p.tareas_total) * 100) : 0;
                                            return (
                                                <tr key={p.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                                                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{p.name}</td>
                                                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{p.cliente_name}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                            p.status === 'En progreso' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                                            p.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.tareas_completadas}/{p.tareas_total}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden max-w-[80px]">
                                                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{width:`${pct}%`}}></div>
                                                            </div>
                                                            <span className="text-xs text-slate-500">{pct}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{p.date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </AdminLayout>
    );
}
