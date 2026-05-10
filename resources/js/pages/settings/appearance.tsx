import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';
import { Palette } from 'lucide-react';

export default function Appearance() {
    return (
        <>
            <Head title="Ajustes de Apariencia" />

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Apariencia del Sistema</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Personaliza cómo se ve tu interfaz y elige tu tema preferido.</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 transition-colors duration-500">
                        <AppearanceTabs />
                    </div>
                </section>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Ajustes de Apariencia',
            href: editAppearance().url,
        },
    ],
};
