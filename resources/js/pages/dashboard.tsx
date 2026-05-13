import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckSquare, Activity } from 'lucide-react';
import axios from 'axios';

// Import Layout
import AdminLayout from '@/layouts/admin-layout';

// Import dashboard components
import StatsCard from '@/components/dashboard/stats-card';
import DashboardChart from '@/components/dashboard/dashboard-chart';
import DashboardInsights from '@/components/dashboard/dashboard-insights';
import UsersTable from '@/components/dashboard/users-table';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    
    // API Data States
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [proyectosPie, setProyectosPie] = useState<any[]>([]);
    const [tareasPie, setTareasPie] = useState<any[]>([]);
    const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
    const [topClientes, setTopClientes] = useState<any[]>([]);
    const [mensajesStats, setMensajesStats] = useState({ pendiente: 0, leido: 0 });
    const [users, setUsers] = useState<any[]>([]);

    // Role check
    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'Administrador';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch data from our new API endpoint
                const response = await axios.get('/api/dashboard', {
                    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
                    params: { _t: Date.now() },
                });
                const data = response.data;
                
                setStats(data.stats);
                setChartData(data.chartData);
                setProyectosPie(data.proyectosStatusPie ?? []);
                setTareasPie(data.tareasStatusPie ?? []);
                setWeeklyActivity(data.weeklyActivity ?? []);
                setTopClientes(data.topClientes ?? []);
                setMensajesStats(data.mensajesStats ?? { pendiente: 0, leido: 0 });
                setUsers(data.recentUsers);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AdminLayout 
            title="Resumen Empresarial" 
            description="Visualiza el rendimiento de tus proyectos, tareas y equipo en tiempo real."
        >
            {/* Stats Cards */}
            <motion.div
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
                <StatsCard 
                    isLoading={isLoading}
                    title="Clientes Totales" 
                    value={stats?.clientes || 0} 
                    trend={stats?.trends?.clientes || "+0%"} 
                    icon={Users} 
                    color="text-sky-400" 
                    bg="bg-sky-500/10" 
                />
                <StatsCard 
                    isLoading={isLoading}
                    title="Proyectos Activos" 
                    value={stats?.proyectos || 0} 
                    trend={stats?.trends?.proyectos || "+0%"} 
                    icon={Briefcase} 
                    color="text-blue-400" 
                    bg="bg-blue-500/10" 
                />
                <StatsCard 
                    isLoading={isLoading}
                    title="Tareas Pendientes" 
                    value={stats?.tareas || 0} 
                    trend={stats?.trends?.tareas || "+0%"} 
                    icon={CheckSquare} 
                    color="text-indigo-400" 
                    bg="bg-indigo-500/10" 
                />
                <StatsCard 
                    isLoading={isLoading}
                    title="Usuarios Registrados" 
                    value={stats?.usuarios || 0} 
                    trend={stats?.trends?.usuarios || "+0%"} 
                    icon={Activity} 
                    color="text-emerald-400" 
                    bg="bg-emerald-500/10" 
                />
            </motion.div>

            <div className="w-full">
                <DashboardChart data={chartData} isLoading={isLoading} />
            </div>

            <DashboardInsights
                proyectosPie={proyectosPie}
                tareasPie={tareasPie}
                weekly={weeklyActivity}
                topClientes={topClientes}
                mensajesStats={mensajesStats}
                isLoading={isLoading}
            />
            {isAdmin && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                    <UsersTable users={users} isLoading={isLoading} />
                </motion.div>
            )}
        </AdminLayout>
    );
}
