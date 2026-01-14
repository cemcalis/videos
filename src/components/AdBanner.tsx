import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdBannerProps {
  id: string;
  imageUrl: string;
  linkUrl: string;
  position: "top" | "sidebar" | "inline" | "bottom";
  onClose?: () => void;
  showClose?: boolean;
}

const AdBanner = ({ imageUrl, linkUrl, position, onClose, showClose = true }: AdBannerProps) => {
  const positionStyles = {
    top: "w-full h-20 md:h-24",
    sidebar: "w-full aspect-[3/4]",
    inline: "w-full aspect-video",
    bottom: "w-full h-16 md:h-20",
  };

  return (
    <div className={`relative rounded-lg overflow-hidden bg-secondary ${positionStyles[position]}`}>
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        <img 
          src={imageUrl} 
          alt="Reklam"
          className="w-full h-full object-cover"
        />
      </a>
      {showClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1 right-1 w-6 h-6 bg-background/80 hover:bg-background rounded-full"
          onClick={(e) => {
            e.preventDefault();
            onClose?.();
          }}
        >
          <X size={14} />
        </Button>
      )}
      <span className="absolute bottom-1 left-1 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
        Reklam
      </span>
    </div>
  );
};

export default AdBanner;
