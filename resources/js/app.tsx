import axios from 'axios';
import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use((config) => {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    if (match?.[1]) {
        config.headers.set('X-XSRF-TOKEN', decodeURIComponent(match[1]));
    }
    return config;
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'dashboard':
            case name === 'clientes':
            case name === 'clientes/show':
            case name === 'usuarios':
            case name === 'roles':
            case name === 'reportes':
            case name === 'proyectos':
            case name === 'proyectos/show':
            case name === 'tareas':
            case name === 'tareas/show':
            case name === 'cliente-dashboard':
            case name === 'buscar':
            case name === 'mensajes':
            case name === 'actividad':
            case name === 'asignaciones':
                return null;
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return null;
            case name.startsWith('settings/'):
                return SettingsLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
