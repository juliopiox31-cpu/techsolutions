import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-neutral-800 border border-slate-200 dark:border-white/5',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-lg px-4 py-2 transition-all duration-300',
                        appearance === value
                            ? 'bg-white shadow-sm text-blue-600 dark:bg-neutral-700 dark:text-neutral-100 ring-1 ring-slate-200 dark:ring-transparent'
                            : 'text-slate-500 hover:bg-white/50 dark:text-neutral-400 dark:hover:bg-neutral-700/60 hover:text-slate-900 dark:hover:text-white',
                    )}
                >
                    <Icon className={cn("h-4 w-4", appearance === value ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                    <span className="ml-2 text-sm font-semibold">{label}</span>
                </button>
            ))}
        </div>
    );
}
