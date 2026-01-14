import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Shield, FileText, Youtube, Twitter, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black/80 border-t border-white/5 pt-20 pb-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1 space-y-6">
                        <Logo size="md" />
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            Türkiye'nin en seçkin yetişkin video hub deneyimi.
                            Sınırsız kalite, mutlak gizlilik.
                        </p>
                        <div className="flex items-center gap-5">
                            {[Youtube, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-8 text-primary/80">Keşfet</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link></li>
                            <li><Link to="/shorts" className="hover:text-primary transition-colors">Shorts</Link></li>
                            <li><Link to="/categories" className="hover:text-primary transition-colors">Kategoriler</Link></li>
                            <li><Link to="/premium" className="hover:text-primary transition-colors">Elite Hub</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-8 text-primary/80">Kurumsal</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Gizlilik</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Koşullar</Link></li>
                            <li><Link to="/dmca" className="hover:text-primary transition-colors">DMCA</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-8 text-primary/80">İletişim</h4>
                        <ul className="space-y-4 text-xs font-bold tracking-widest text-muted-foreground">
                            <li>VIP Destek: <span className="text-white">destek@hdyatak.com</span></li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                7/24 Kesintisiz Yayın
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">
                        © 2024 HDYATAK.COM — Tüm Hakları Saklıdır. +18
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Shield size={10} className="text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">Secure SSL Encryption</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
