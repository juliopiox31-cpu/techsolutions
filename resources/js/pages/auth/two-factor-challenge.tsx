import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ShieldCheck, ArrowRight, Key, Smartphone, RefreshCw } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        code: '',
        recovery_code: '',
    });

    const authConfigContent = useMemo(() => {
        if (showRecoveryInput) {
            return {
                title: 'Código de recuperación',
                description: 'Ingresa uno de tus códigos de emergencia para acceder a tu cuenta de forma segura.',
                toggleText: 'Usar código de autenticación',
            };
        }

        return {
            title: 'Código de autenticación',
            description: 'Ingresa el código generado por tu aplicación de autenticación para continuar.',
            toggleText: 'Usar un código de recuperación',
        };
    }, [showRecoveryInput]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/two-factor-challenge');
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

    const toggleRecoveryMode = (): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setData({
            code: '',
            recovery_code: '',
        });
    };

    return (
        <>
            <Head title="Doble factor de autenticación" />

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
                                    {authConfigContent.title}
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    {authConfigContent.description}
                                </p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-6">
                                <motion.div variants={fadeUp} className="flex flex-col items-center">
                                    {showRecoveryInput ? (
                                        <div className="w-full space-y-2">
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                                    <Key className="h-4 w-4" />
                                                </div>
                                                <input
                                                    name="recovery_code"
                                                    type="text"
                                                    value={data.recovery_code}
                                                    onChange={(e) => setData('recovery_code', e.target.value)}
                                                    placeholder="Código de recuperación"
                                                    className="block w-full h-11 pl-10 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                                    autoFocus={showRecoveryInput}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.recovery_code} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center w-full">
                                            <InputOTP
                                                maxLength={6}
                                                value={data.code}
                                                onChange={(value) => setData('code', value)}
                                                disabled={processing}
                                                pattern={REGEXP_ONLY_DIGITS}
                                            >
                                                <InputOTPGroup className="gap-2">
                                                    {Array.from({ length: 6 }, (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="bg-slate-950/50 border-slate-800 rounded-lg w-10 h-12 text-lg font-bold text-white focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <InputError message={errors.code} className="mt-2" />
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 flex justify-center items-center group border-none disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={processing}
                                    >
                                        {processing ? <Spinner className="mr-2" /> : <ShieldCheck className="mr-2 w-4 h-4" />}
                                        Continuar
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>

                                <motion.div variants={fadeUp} className="text-center">
                                    <button
                                        type="button"
                                        className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors group"
                                        onClick={toggleRecoveryMode}
                                    >
                                        <RefreshCw className="mr-2 w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                        {authConfigContent.toggleText}
                                    </button>
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
                                className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center"
                            >
                                {showRecoveryInput ? (
                                    <Key className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                ) : (
                                    <Smartphone className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                )}
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Seguridad en Dos Pasos</h2>
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    Añadimos una capa extra de protección para asegurar que solo tú puedas acceder a tu entorno tecnológico.
                                </p>
                            </motion.div>

                            {/* Animated digital bars decorative */}
                            <div className="flex gap-1 items-end h-8 pt-4">
                                {[0.5, 0.8, 0.4, 0.9, 0.6].map((scale, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 28, 8] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-cyan-300/40 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
