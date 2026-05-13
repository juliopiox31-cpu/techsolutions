import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    Shield,
    Activity,
    Zap,
    Cpu,
    Globe,
    BarChart3,
    Clock,
    Search,
    Bell,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as any;

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <>
            <Head title="TechSolutions - Gestión Empresarial" />
            <div className="min-h-screen bg-[#0F172A] text-slate-50 overflow-hidden font-sans selection:bg-blue-500/30 relative">

                {/* Background Animated Gradients */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Dark gradient base */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-[#0F172A] to-[#0F172A]"></div>

                    {/* Animated Glow Blobs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] left-[5%] w-[700px] h-[700px] rounded-full bg-blue-600/15 blur-[130px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.25, 0.15],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-400/5 blur-[150px]"
                    />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/[0.08]">
                        {/* Logo: solo icono en móvil, logo completo en sm+ */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0">
                            <AppLogoIcon className="w-9 h-9" />
                            <span className="hidden sm:block font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-200/80">
                                Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Solutions</span>
                            </span>
                        </Link>

                        <nav className="flex items-center gap-2 shrink-0">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/[0.06] whitespace-nowrap"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border border-white/10 whitespace-nowrap shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                                        >
                                            Registrarse
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Main Content Hero */}
                    <main className="flex-grow flex flex-col items-center pt-24 pb-20">
                        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                            >
                                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Plataforma Empresarial Integral</span>
                                </motion.div>

                                <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
                                    Gestiona clientes y proyectos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">una sola plataforma</span>
                                </motion.h1>

                                <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                                    Centraliza la información de tu empresa, mejora el seguimiento de proyectos y optimiza la productividad de tu equipo con nuestra solución SaaS.
                                </motion.p>

                                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                                    <Link
                                        href={auth?.user ? "/dashboard" : "/register"}
                                        className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group border border-white/10 hover:scale-[1.02]"
                                    >
                                        Comenzar ahora
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <a
                                        href="#features"
                                        className="w-full sm:w-auto px-8 py-3.5 text-base font-medium rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                                    >
                                        Ver funciones
                                    </a>
                                </motion.div>
                            </motion.div>
                        </div>

                    </main>


                    {/* Features Section */}
                    <section id="features" className="container mx-auto px-6 py-24 relative z-10 border-t border-white/[0.05] mt-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Todo lo que necesitas para escalar</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Herramientas diseñadas para mantener a tu equipo enfocado, con una interfaz rápida y sin distracciones.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Users,
                                    title: "Gestión de clientes",
                                    desc: "Mantén un registro detallado de tus clientes, contactos y oportunidades de venta en un CRM integrado."
                                },
                                {
                                    icon: Briefcase,
                                    title: "Control de proyectos",
                                    desc: "Organiza tus proyectos en fases, asigna responsables y monitorea el progreso en tiempo real."
                                },
                                {
                                    icon: CheckSquare,
                                    title: "Seguimiento de tareas",
                                    desc: "Crea tareas, establece fechas límite y asegúrate de que nada se quede en el tintero."
                                },
                                {
                                    icon: Shield,
                                    title: "Administración segura",
                                    desc: "Controla accesos con roles y permisos detallados para mantener tu información protegida."
                                }
                            ].map((card, i) => {
                                const Icon = card.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="p-8 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02] transition-all duration-300 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600/20 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            {Icon && <Icon className="w-6 h-6 text-blue-400 relative z-10" />}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-3 text-slate-100 tracking-tight">{card.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="border-t border-white/[0.08] bg-[#0F172A] py-8 mt-auto relative z-10">
                        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <AppLogoIcon className="w-7 h-7 opacity-80" />
                                <span className="text-sm font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/40 to-blue-400/40">
                                    Tech<span className="text-blue-500/40">Solutions</span>
                                </span>
                            </div>
                            <div className="text-sm text-slate-500">
                                &copy; {new Date().getFullYear()} TechSolutions Inc. Todos los derechos reservados.
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
