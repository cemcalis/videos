import { useState } from "react";
import { Search, Bell, Crown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { isPremium } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5 supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-white/5 rounded-full transition-transform active:scale-95 text-foreground/80"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </Button>
          <Link to="/" className="group transition-all duration-300 hover:scale-105 active:scale-95">
            <Logo size="md" />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "Ana Sayfa", path: "/" },
            { label: "Shorts", path: "/shorts" },
            { label: "Trendler", path: "/trending" },
            { label: "Kategoriler", path: "/categories" }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground relative group transition-colors duration-300"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out" />
            </Link>
          ))}
        </nav>

        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" size={16} />
            <Input
              placeholder="Sınırsız eğlenceyi keşfet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-10 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-primary/20 transition-all duration-500 rounded-2xl placeholder:text-muted-foreground/50 shadow-inner group-hover:bg-white/[0.04]"
            />
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
          </form>
        </div>

        <div className="flex items-center gap-3">
          {isPremium && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-hdyatak-gold/10 to-hdyatak-gold/20 border border-hdyatak-gold/30 shadow-gold group cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm animate-cinematic-in">
              <Crown size={14} className="text-hdyatak-gold group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-[12px] font-black tracking-widest uppercase hdyatak-premium-text">Elite</span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-white/5 rounded-full relative group transition-all text-muted-foreground hover:text-foreground">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background group-hover:animate-ping" />
          </Button>

          <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block" />

          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
