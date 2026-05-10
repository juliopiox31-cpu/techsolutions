import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/user/confirm-password', {
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
            <Head title="Confirmar contraseña" />

            {/* Background Container */}
            <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30 text-slate-50 relative">
                
                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px] pointer-events-none"></div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl h-full max-h-[90vh] lg:max-h-[500px] bg-slate-900 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-white/5 overflow-hidden relative z-10 flex flex-col lg:flex-row"
                >
                    {/* Left Panel: Form */}
                    <div className="w-full lg:w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center relative bg-slate-900">
                        
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
                            className="max-w-sm w-full mx-auto lg:mx-0"
                        >
                            <motion.div variants={fadeUp} className="mb-6">
                                <h1 className="text-2xl font-bold tracking-tight mb-2">
                                    Área segura
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Esta es un área protegida. Por favor confirma tu contraseña para continuar.
                                </p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-5">
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
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full h-11 pl-10 pr-10 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                            autoFocus
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
                                        <div className="mt-1.5">
                                            <InputError message={errors.password} />
                                        </div>
                                    )}
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={fadeUp} className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 border-none flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <>
                                                Confirmar acceso
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Panel: Illustration */}
                    <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 overflow-hidden">
                        {/* Dynamic Background Effects */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-cyan-400/20 blur-[80px]"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-blue-400/20 blur-[80px]"
                        />

                        {/* Content Wrap */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xs">
                            <motion.div
                                animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center"
                            >
                                <ShieldCheck className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Protección Avanzada</h2>
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    Estamos verificando tus credenciales para asegurar que solo tú puedas acceder a estas configuraciones sensibles.
                                </p>
                            </motion.div>

                            {/* Decorative Activity Bar */}
                            <div className="flex gap-2 items-center justify-center w-full pt-4">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                    />
                                </div>
                                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
