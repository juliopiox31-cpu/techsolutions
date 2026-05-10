import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, Lock, Key, CheckCircle2, Loader2, Save, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import { motion } from 'framer-motion';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors: twoFactorErrors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Ajustes de Seguridad" />

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Actualizar Contraseña</h2>
                            <p className="text-sm text-slate-400">Asegúrate de usar una contraseña larga y aleatoria para mantenerte seguro.</p>
                        </div>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={[ 'password', 'password_confirmation', 'current_password' ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="current_password" className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Contraseña Actual</label>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                type="password"
                                                name="current_password"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="password" className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    id="password"
                                                    ref={passwordInput}
                                                    type="password"
                                                    name="password"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="password_confirmation" className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                                            <div className="relative group">
                                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={processing}
                                        className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl text-sm font-bold text-white transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : recentlySuccessful ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {processing ? 'Actualizando...' : recentlySuccessful ? 'Actualizado' : 'Guardar Contraseña'}
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                {canManageTwoFactor && (
                    <>
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Autenticación de Dos Factores</h2>
                                    <p className="text-sm text-slate-400">Añade una capa extra de seguridad a tu cuenta.</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 space-y-6">
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Cuando la autenticación de dos factores está habilitada, se te solicitará un pin seguro y aleatorio durante el inicio de sesión, el cual puedes obtener desde la aplicación de autenticación de tu teléfono.
                                </p>

                                {twoFactorEnabled ? (
                                    <div className="space-y-6">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-6 py-3 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 text-sm font-bold transition-all"
                                                >
                                                    {processing ? 'Desactivando...' : 'Desactivar 2FA'}
                                                </button>
                                            )}
                                        </Form>

                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={recoveryCodesList}
                                            fetchRecoveryCodes={fetchRecoveryCodes}
                                            errors={twoFactorErrors}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            {hasSetupData ? (
                                                <button
                                                    onClick={() => setShowSetupModal(true)}
                                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Continuar Configuración
                                                </button>
                                            ) : (
                                                <Form
                                                    {...enable.form()}
                                                    onSuccess={() => setShowSetupModal(true)}
                                                >
                                                    {({ processing }) => (
                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                                                        >
                                                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                            Activar 2FA
                                                        </button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={twoFactorErrors}
                            />
                        </section>
                    </>
                )}
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Ajustes de Seguridad',
            href: edit().url,
        },
    ],
};
