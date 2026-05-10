import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { FormEventHandler } from 'react';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
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
            <Head title="Recuperar contraseña" />

            <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30 text-slate-50 relative">
                
                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none"></div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl h-full max-h-[90vh] lg:max-h-[500px] bg-slate-900 rounded-[2rem] shadow-2xl shadow-indigo-900/20 border border-white/5 overflow-hidden relative z-10 flex flex-col lg:flex-row"
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
                                    ¿Olvidaste tu contraseña?
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                                </p>
                            </motion.div>

                            {status && (
                                <motion.div variants={fadeUp} className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                    <span>{status}</span>
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Input */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Correo electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full h-11 pl-10 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                                            placeholder="nombre@empresa.com"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="mt-1.5">
                                            <InputError message={errors.email} />
                                        </div>
                                    )}
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={fadeUp} className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 border-none flex justify-center items-center group disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <>
                                                Enviar enlace
                                                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>

                            <motion.div variants={fadeUp} className="mt-6 pt-5 border-t border-white/5 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="mr-2 w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    Volver al inicio de sesión
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Illustration */}
                    <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-800 overflow-hidden">
                        {/* Dynamic Background Effects */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-[80px]"
                        />
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xs">
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center"
                            >
                                <Mail className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Recuperación de Cuenta</h2>
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    No te preocupes, nos pasa a todos. Te enviaremos las instrucciones necesarias para que recuperes el acceso de forma segura y rápida.
                                </p>
                            </motion.div>

                            {/* Progress bar effect */}
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                                <motion.div 
                                    animate={{ width: ['0%', '100%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-full bg-blue-300 shadow-[0_0_15px_rgba(147,197,253,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
