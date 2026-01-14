import { Search, Bell, User, Crown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";
import { Link } from "react-router-dom";

interface HeaderProps {
  isPremium?: boolean;
  onMenuClick?: () => void;
}

const Header = ({ isPremium = false, onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </Button>
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Ana Sayfa
          </Link>
          <Link to="/shorts" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Shorts
          </Link>
          <Link to="/trending" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Trendler
          </Link>
          <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Kategoriler
          </Link>
        </nav>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Video ara..." 
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPremium && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hdyatak-gold/10 border border-hdyatak-gold/30">
              <Crown size={16} className="text-hdyatak-gold" />
              <span className="text-sm font-semibold hdyatak-premium-text">Premium</span>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell size={20} />
          </Button>
          
          <Link to="/admin">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Admin
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
