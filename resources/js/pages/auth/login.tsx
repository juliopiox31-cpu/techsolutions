import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    ArrowRight,
    Zap,
    Cpu,
    CheckCircle2
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Login({ status, canResetPassword = true }: { status?: string, canResetPassword?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            {/* Background Container - 100vh sin scroll */}
            <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30 text-slate-50 relative">

                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px] pointer-events-none"></div>

                {/* Main Card - Control estricto de altura */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-6xl h-full max-h-[90vh] lg:max-h-[750px] bg-slate-900 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-white/5 overflow-hidden relative z-10 flex flex-col lg:flex-row"
                >

                    {/* Left Panel: Login Form */}
                    <div className="w-full lg:w-1/2 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative bg-slate-900">

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <AppLogo />
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="max-w-sm w-full mx-auto lg:mx-0 flex-grow flex flex-col justify-center"
                        >
                            <motion.div variants={fadeUp} className="mb-6">
                                <h1 className="text-3xl font-bold tracking-tight mb-1.5">
                                    Iniciar sesión
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Ingresa tus credenciales para acceder.
                                </p>
                            </motion.div>

                            {status && (
                                <motion.div variants={fadeUp} className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{status}</span>
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="flex flex-col gap-4">
                                {/* Email Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Correo electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full h-11 pl-10 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                            placeholder="nombre@empresa.com"
                                            required
                                            autoFocus
                                            autoComplete="username"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                                    )}
                                </motion.div>

                                {/* Password Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full h-11 pl-10 pr-10 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                                    )}
                                </motion.div>

                                {/* Remember Me & Forgot Password */}
                                <motion.div variants={fadeUp} className="flex items-center justify-between mt-0.5">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-4 h-4 border border-slate-700 rounded bg-slate-950/50 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500/30 transition-all duration-200 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="ml-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                            Recordarme
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={fadeUp} className="mt-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                Entrar
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </form>

                            {/* Register Link */}
                            <motion.div variants={fadeUp} className="mt-6 pt-5 border-t border-white/5 text-center">
                                <p className="text-xs text-slate-400">
                                    ¿No tienes una cuenta?{' '}
                                    <Link href="/register" className="font-semibold text-white hover:text-blue-400 transition-colors">
                                        Regístrate ahora
                                    </Link>
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Welcome & Illustration */}
                    <div className="w-full lg:w-1/2 h-full relative hidden lg:flex flex-col items-center justify-center p-8 overflow-hidden">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 z-0"></div>

                        {/* Animated Orbs */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-cyan-400/30 blur-[80px] z-0"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-blue-400/30 blur-[80px] z-0"
                        />

                        {/* Content Wrap */}
                        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center h-full justify-center space-y-8">

                            {/* Text Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                                    Bienvenido a <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                                        TechSolutions
                                    </span>
                                </h2>
                                <p className="text-blue-100/80 text-sm leading-relaxed px-4">
                                    Plataforma centralizada para gestionar, analizar y escalar tus operaciones tecnológicas.
                                </p>
                            </motion.div>

                            {/* CSS/Div Based Illustration (Compact) */}
                            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                                {/* Base Platform Circle */}
                                <div className="absolute w-full h-full rounded-full border border-white/10 shadow-[inset_0_0_60px_rgba(255,255,255,0.05)]"></div>
                                <div className="absolute w-[70%] h-[70%] rounded-full border border-white/20 border-dashed"></div>

                                {/* Floating Card 1: Stats */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-[5%] left-[0%] w-32 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-20"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
                                            <Zap className="w-3 h-3 text-cyan-300" />
                                        </div>
                                        <div className="text-[10px] font-semibold text-white">Rendimiento</div>
                                    </div>
                                    <div className="flex gap-1 items-end h-10">
                                        {[40, 70, 45, 90, 65].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500/50 to-cyan-300/80 rounded-t-[2px]" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Floating Card 2: Security */}
                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-[10%] right-[-5%] w-36 p-3 rounded-xl bg-indigo-900/40 backdrop-blur-md border border-indigo-300/20 shadow-xl z-20"
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <ShieldCheck className="w-4 h-4 text-indigo-300" />
                                        <span className="px-1.5 py-0.5 rounded-full bg-green-400/20 text-[8px] font-bold text-green-300 border border-green-400/30">
                                            ACTIVO
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-white mb-1">Cifrado End-to-End</div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
                                        <div className="w-[100%] h-full bg-green-400 rounded-full"></div>
                                    </div>
                                </motion.div>

                                {/* Central Focus Element */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-[160px] h-[160px] rounded-full border border-white/10 flex items-center justify-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-0 -translate-y-1/2 shadow-[0_0_10px_#22d3ee]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 absolute bottom-0 translate-y-1/2 shadow-[0_0_8px_#818cf8]"></div>
                                </motion.div>

                                {/* Center Core Logo/Icon */}
                                <motion.div
                                    animate={{ scale: [0.95, 1.05, 0.95] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center z-10"
                                >
                                    <Cpu className="w-7 h-7 text-white" />
                                </motion.div>
                            </div>

                        </div>
                    </div>

                </motion.div>
            </div>
        </>
    );
}