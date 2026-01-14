import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumBadgeProps {
  variant?: "small" | "large" | "card";
}

const PremiumBadge = ({ variant = "small" }: PremiumBadgeProps) => {
  if (variant === "card") {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 hdyatak-card border border-hdyatak-gold/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-hdyatak-gold/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hdyatak-gold to-hdyatak-premium flex items-center justify-center hdyatak-premium-glow">
              <Crown size={24} className="text-background" />
            </div>
            <div>
              <h3 className="text-xl font-bold hdyatak-premium-text">Premium'a Geç</h3>
              <p className="text-sm text-muted-foreground">Reklamsız izle</p>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles size={14} className="text-hdyatak-gold" />
              Reklamsız video izleme
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles size={14} className="text-hdyatak-gold" />
              HD ve 4K kalite
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <Sparkles size={14} className="text-hdyatak-gold" />
              Öncelikli destek
            </li>
          </ul>
          <Button className="w-full bg-gradient-to-r from-hdyatak-gold to-hdyatak-premium text-background font-semibold hover:opacity-90">
            Şimdi Başla
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-hdyatak-gold/10 border border-hdyatak-gold/30 hdyatak-premium-glow">
        <Crown size={20} className="text-hdyatak-gold" />
        <span className="font-bold hdyatak-premium-text">Premium Üye</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-hdyatak-gold/10 border border-hdyatak-gold/30">
      <Crown size={12} className="text-hdyatak-gold" />
      <span className="text-xs font-semibold hdyatak-premium-text">Premium</span>
    </div>
  );
};

export default PremiumBadge;
