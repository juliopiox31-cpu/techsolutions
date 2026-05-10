import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <Trash2 className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Eliminar Cuenta</h2>
                    <p className="text-sm text-slate-400">Elimina permanentemente tu cuenta y todos sus datos.</p>
                </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full pointer-events-none" />
                
                <div className="flex gap-4 relative z-10">
                    <div className="p-3 rounded-2xl bg-rose-500/10 h-fit text-rose-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-rose-100">Zona de Peligro</p>
                        <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, procede con extrema precaución.
                        </p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3.5 bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-500 border border-rose-500/20 rounded-2xl text-sm font-bold transition-all relative z-10 whitespace-nowrap"
                        >
                            Eliminar mi Cuenta
                        </motion.button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111827] border-white/10 rounded-3xl p-0 overflow-hidden max-w-lg">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <DialogClose className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </DialogClose>
                            </div>

                            <div className="space-y-2">
                                <DialogTitle className="text-2xl font-bold text-white">¿Estás absolutamente seguro?</DialogTitle>
                                <DialogDescription className="text-slate-400 leading-relaxed">
                                    Esta acción eliminará permanentemente todos tus proyectos, tareas y datos personales. Por favor, introduce tu contraseña para confirmar.
                                </DialogDescription>
                            </div>

                            <Form
                                {...ProfileController.destroy.form()}
                                options={{ preserveScroll: true }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ resetAndClearErrors, processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                ref={passwordInput}
                                                placeholder="Introduce tu contraseña"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                                autoComplete="current-password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <DialogClose asChild>
                                                <button
                                                    onClick={() => resetAndClearErrors()}
                                                    className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                            </DialogClose>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all shadow-xl shadow-rose-900/40 disabled:opacity-50"
                                            >
                                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Eliminar Definitivamente
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
