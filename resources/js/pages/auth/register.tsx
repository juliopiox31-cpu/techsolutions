import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    ArrowRight,
    Globe,
    Activity,
    Sparkles,
    Briefcase,
    Phone
} from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
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
            <Head title="Crear cuenta" />

            {/* Background Container - 100vh sin scroll */}
            <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500/30 text-slate-50 relative">

                {/* Ambient Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[150px] pointer-events-none"></div>

                {/* Main Card - Control estricto de altura */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-6xl h-full max-h-[90vh] lg:max-h-[750px] bg-slate-900 rounded-[2rem] shadow-2xl shadow-cyan-900/20 border border-white/5 overflow-hidden relative z-10 flex flex-col lg:flex-row"
                >

                    {/* Left Panel: Register Form */}
                    <div className="w-full lg:w-1/2 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative bg-slate-900">

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <AppLogo />
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="max-w-sm w-full mx-auto lg:mx-0 flex-grow flex flex-col justify-center"
                        >
                            <motion.div variants={fadeUp} className="mb-5">
                                <h1 className="text-3xl font-bold tracking-tight mb-1.5">
                                    Crear cuenta
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Únete a nuestra plataforma hoy mismo.
                                </p>
                            </motion.div>

                            <form onSubmit={submit} className="flex flex-col gap-3">
                                {/* Name Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Nombre completo
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="Juan Pérez"
                                            required
                                            autoFocus
                                            autoComplete="name"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                                    )}
                                </motion.div>

                                {/* Email Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Correo electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="nombre@empresa.com"
                                            required
                                            autoComplete="username"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                                    )}
                                </motion.div>

                                {/* Company Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Empresa
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="Nombre de tu empresa"
                                        />
                                    </div>
                                    {errors.company && (
                                        <p className="mt-1 text-xs text-red-400">{errors.company}</p>
                                    )}
                                </motion.div>

                                {/* Phone Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Teléfono
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="Ej. +1 234 567 890"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                                    )}
                                </motion.div>

                                {/* Password Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-10 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                                    )}
                                </motion.div>

                                {/* Confirm Password Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="block w-full h-10 pl-9 pr-10 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-400">{errors.password_confirmation}</p>
                                    )}
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={fadeUp} className="mt-2">
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
                                                Crear cuenta
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </form>

                            {/* Login Link */}
                            <motion.div variants={fadeUp} className="mt-5 pt-4 border-t border-white/5 text-center">
                                <p className="text-xs text-slate-400">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link href="/login" className="font-semibold text-white hover:text-cyan-400 transition-colors">
                                        Iniciar sesión
                                    </Link>
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Welcome & Visual */}
                    <div className="w-full lg:w-1/2 h-full relative hidden lg:flex flex-col items-center justify-center p-8 overflow-hidden">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-800 z-0"></div>

                        {/* Animated Orbs */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/30 blur-[80px] z-0"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-cyan-400/30 blur-[80px] z-0"
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
                                    Únete a <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                                        TechSolutions
                                    </span>
                                </h2>
                                <p className="text-blue-100/80 text-sm leading-relaxed px-4">
                                    El ecosistema perfecto para impulsar el crecimiento de tu organización.
                                </p>
                            </motion.div>

                            {/* CSS/Div Based Illustration (Compact) */}
                            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                                {/* Base Platform Circle */}
                                <div className="absolute w-full h-full rounded-full border border-white/10 shadow-[inset_0_0_60px_rgba(255,255,255,0.05)]"></div>
                                <div className="absolute w-[70%] h-[70%] rounded-full border border-white/20 border-dashed"></div>
                                <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-400/30"></div>

                                {/* Floating Card 1: Community */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-[5%] right-[0%] w-32 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-20"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                                            <Globe className="w-3 h-3 text-blue-300" />
                                        </div>
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-white mb-0.5">Comunidad Global</div>
                                    <div className="text-xs text-blue-200 font-bold">+10,000 usuarios</div>
                                </motion.div>

                                {/* Floating Card 2: Activity */}
                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-[10%] left-[-5%] w-36 p-3 rounded-xl bg-blue-900/40 backdrop-blur-md border border-cyan-300/20 shadow-xl z-20"
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Activity className="w-4 h-4 text-cyan-300" />
                                        <div className="text-[10px] font-semibold text-white">Sincronización en vivo</div>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-[50%] h-full bg-cyan-400 rounded-full"
                                        ></motion.div>
                                    </div>
                                </motion.div>

                                {/* Central Focus Element */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-[200px] h-[200px] rounded-full border border-white/5 flex items-center justify-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-0 -translate-y-1/2 shadow-[0_0_10px_#22d3ee]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-0 translate-y-1/2 shadow-[0_0_8px_#ffffff]"></div>
                                </motion.div>

                                {/* Center Core Logo/Icon */}
                                <motion.div
                                    animate={{ scale: [0.95, 1.05, 0.95] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center z-10 relative"
                                >
                                    <Sparkles className="w-7 h-7 text-white" />
                                    {/* Particle effects */}
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: -20, x: 20 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute top-0 right-0 w-1.5 h-1.5 bg-cyan-300 rounded-full blur-[1px]"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: 20, x: -20 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                                        className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-blue-300 rounded-full blur-[1px]"
                                    />
                                </motion.div>
                            </div>

                        </div>
                    </div>

                </motion.div>
            </div>
        </>
    );
}
