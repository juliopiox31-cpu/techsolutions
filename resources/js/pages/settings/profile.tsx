import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Save, User, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="Ajustes de Perfil" />

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Información del Perfil</h2>
                            <p className="text-sm text-slate-400">Actualiza tu nombre y dirección de correo electrónico.</p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-8"
                    >
                        {({ processing, errors, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                id="name"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                id="email"
                                                type="email"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.05] transition-all"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-300">
                                                Tu dirección de correo no está verificada.{' '}
                                                <Link
                                                    href={send().url}
                                                    as="button"
                                                    className="text-amber-400 font-bold hover:text-amber-300 transition-colors"
                                                >
                                                    Haz clic aquí para reenviar el correo de verificación.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-xs font-medium text-emerald-400">
                                                    Se ha enviado un nuevo enlace de verificación a tu correo.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
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
                                        {processing ? 'Guardando...' : recentlySuccessful ? 'Guardado' : 'Guardar Cambios'}
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <section>
                    <DeleteUser />
                </section>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Ajustes de Perfil',
            href: edit().url,
        },
    ],
};
