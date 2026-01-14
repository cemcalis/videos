import { Play } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 28, text: "text-2xl" },
    lg: { icon: 40, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary rounded-lg blur-md opacity-50" />
        <div className="relative bg-primary rounded-lg p-1.5 flex items-center justify-center hdyatak-glow">
          <Play 
            size={sizes[size].icon} 
            className="text-primary-foreground fill-current" 
          />
        </div>
      </div>
      {showText && (
        <span className={`font-black tracking-tight ${sizes[size].text}`}>
          <span className="text-foreground">HD</span>
          <span className="hdyatak-gradient-text">YATAK</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
