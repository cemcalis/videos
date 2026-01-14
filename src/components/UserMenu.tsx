import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Crown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, profile, isPremium, signOut } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success("Çıkış yapıldı");
      navigate("/");
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="default" 
        size="sm"
        onClick={() => navigate("/auth")}
        className="bg-primary text-primary-foreground"
      >
        Giriş Yap
      </Button>
    );
  }

  const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "Kullanıcı";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="relative">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              </div>
            )}
            {isPremium && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-hdyatak-gold flex items-center justify-center">
                <Crown size={10} className="text-background" />
              </div>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
          <ChevronDown size={14} className="hidden sm:inline text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {isPremium && (
            <div className="flex items-center gap-1 mt-1">
              <Crown size={12} className="text-hdyatak-gold" />
              <span className="text-xs hdyatak-premium-text font-semibold">Premium Üye</span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
          <User size={16} className="mr-2" />
          Profilim
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
          <Settings size={16} className="mr-2" />
          Ayarlar
        </DropdownMenuItem>
        {!isPremium && (
          <DropdownMenuItem onClick={() => navigate("/premium")} className="cursor-pointer text-hdyatak-gold">
            <Crown size={16} className="mr-2" />
            Premium'a Geç
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-destructive"
          disabled={isLoading}
        >
          <LogOut size={16} className="mr-2" />
          {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
