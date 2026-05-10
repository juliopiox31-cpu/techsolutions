import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, LogOut, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
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
            <Head title="Verificar correo" />

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
                    {/* Left Panel: Content */}
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
                                    Verifica tu correo
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    ¡Gracias por unirte! Por favor verifica tu dirección de correo electrónico haciendo clic en el enlace que acabamos de enviarte.
                                </p>
                            </motion.div>

                            {status === 'verification-link-sent' && (
                                <motion.div variants={fadeUp} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    <span>Se ha enviado un nuevo enlace de verificación a la dirección de correo proporcionada.</span>
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <motion.div variants={fadeUp}>
                                    <Button 
                                        type="submit"
                                        disabled={processing} 
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 flex justify-center items-center group border-none"
                                    >
                                        {processing ? <Spinner className="mr-2" /> : <Mail className="mr-2 w-4 h-4" />}
                                        Reenviar correo de verificación
                                    </Button>
                                </motion.div>

                                <motion.div variants={fadeUp} className="pt-2 text-center">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors group"
                                    >
                                        <LogOut className="mr-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        Cerrar sesión
                                    </Link>
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

                        {/* Content Wrap */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xs">
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Mail className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                </motion.div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Bandeja de Entrada</h2>
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    Si no recibiste el correo, por favor revisa tu carpeta de correo no deseado o solicita un nuevo envío.
                                </p>
                            </motion.div>

                            {/* Floating Envelopes decorative animations */}
                            <div className="relative w-full h-12">
                                <motion.div
                                    animate={{ 
                                        x: [-20, 20, -20], 
                                        y: [0, -10, 0],
                                        opacity: [0, 1, 0] 
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute left-1/4 top-0"
                                >
                                    <Mail className="w-5 h-5 text-cyan-300/40" />
                                </motion.div>
                                <motion.div
                                    animate={{ 
                                        x: [20, -20, 20], 
                                        y: [0, -10, 0],
                                        opacity: [0, 1, 0] 
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                                    className="absolute right-1/4 top-0"
                                >
                                    <Mail className="w-5 h-5 text-blue-300/40" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
