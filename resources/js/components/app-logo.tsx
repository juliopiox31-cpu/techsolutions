import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <AppLogoIcon className="w-9 h-9" />
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-200/80">
                Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Solutions</span>
            </span>
        </div>
    );
}
