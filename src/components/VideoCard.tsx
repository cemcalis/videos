import { Play, Clock, Eye } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
  uploadedAt: string;
  onClick?: () => void;
}

const VideoCard = ({ 
  title, 
  thumbnail, 
  duration, 
  views, 
  channel, 
  uploadedAt,
  onClick 
}: VideoCardProps) => {
  return (
    <div 
      className="group cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary mb-3">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hdyatak-glow">
            <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/90 text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          {duration}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{channel}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {views}
          </span>
          <span>•</span>
          <span>{uploadedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
