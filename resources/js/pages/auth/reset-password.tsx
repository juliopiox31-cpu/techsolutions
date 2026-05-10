import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
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
            <Head title="Restablecer contraseña" />

            {/* Background Container */}
            <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30 text-slate-50 relative">
                
                {/* Ambient Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[150px] pointer-events-none"></div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl h-full max-h-[90vh] lg:max-h-[600px] bg-slate-900 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-white/5 overflow-hidden relative z-10 flex flex-col lg:flex-row"
                >
                    {/* Left Panel: Form */}
                    <div className="w-full lg:w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center relative bg-slate-900 overflow-y-auto">
                        
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
                                    Nueva contraseña
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Ingresa tu nueva contraseña para recuperar el acceso de forma segura.
                                </p>
                            </motion.div>

                            <form onSubmit={submit} className="space-y-4">
                                {/* Email (Read Only) */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Correo electrónico
                                    </label>
                                    <div className="relative group opacity-60">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="block w-full h-11 pl-10 pr-4 bg-slate-950/30 border border-slate-800 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="mt-1.5">
                                            <InputError message={errors.email} />
                                        </div>
                                    )}
                                </motion.div>

                                {/* New Password */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Nueva contraseña
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
                                            autoComplete="new-password"
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

                                {/* Confirm Password */}
                                <motion.div variants={fadeUp}>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="block w-full h-11 pl-10 pr-10 bg-slate-950/50 border border-slate-800 rounded-xl text-sm placeholder-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <div className="mt-1.5">
                                            <InputError message={errors.password_confirmation} />
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
                                                Restablecer contraseña
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

                        {/* Content Wrap */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xs">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-full border-2 border-white/20 border-dashed flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl"
                                >
                                    <RefreshCcw className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                </motion.div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Seguridad Renovada</h2>
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    Actualiza tu contraseña para asegurar que tu cuenta permanezca protegida con los más altos estándares de cifrado.
                                </p>
                            </motion.div>

                            {/* Bouncing dots decorative */}
                            <div className="flex gap-2 pt-4">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                    className="w-2 h-2 rounded-full bg-cyan-400"
                                />
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 rounded-full bg-blue-300"
                                />
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 rounded-full bg-white/20"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
