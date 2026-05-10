import { Zap } from 'lucide-react';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
            {/* Background Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 rounded-xl rotate-6 shadow-lg shadow-blue-500/20"></div>
            
            {/* Glassmorphism layer */}
            <div className="absolute inset-0.5 bg-slate-900/40 backdrop-blur-md rounded-lg border border-white/20 z-10"></div>
            
            {/* Central Icon - Using absolute center with specific size */}
            <div className="relative z-20 flex items-center justify-center">
                <Zap size={20} className="text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
            
            {/* Atmospheric Glow */}
            <div className="absolute -inset-2 bg-blue-500/10 blur-xl rounded-full -z-10 animate-pulse"></div>
        </div>
    );
}
