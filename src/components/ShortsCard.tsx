import { Play, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortsCardProps {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
  channel: string;
  channelAvatar?: string;
  isActive?: boolean;
}

const ShortsCard = ({ 
  title, 
  thumbnail, 
  views, 
  likes, 
  comments, 
  channel,
  channelAvatar,
  isActive = false
}: ShortsCardProps) => {
  return (
    <div className={`shorts-item relative flex items-center justify-center bg-background ${isActive ? 'animate-scale-in' : ''}`}>
      <div className="relative w-full max-w-[400px] h-[calc(100vh-80px)] mx-auto">
        {/* Video container */}
        <div className="relative h-full rounded-2xl overflow-hidden bg-secondary">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hdyatak-glow animate-pulse-glow">
              <Play size={36} className="text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
          
          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary overflow-hidden">
                    {channelAvatar ? (
                      <img src={channelAvatar} alt={channel} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-foreground font-bold">
                        {channel.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{channel}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye size={12} />
                      {views} görüntüleme
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{title}</p>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col gap-4">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/80 backdrop-blur-sm">
                  <Heart size={24} />
                </Button>
                <span className="text-xs text-center text-muted-foreground -mt-2">{likes}</span>
                
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/80 backdrop-blur-sm">
                  <MessageCircle size={24} />
                </Button>
                <span className="text-xs text-center text-muted-foreground -mt-2">{comments}</span>
                
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/80 backdrop-blur-sm">
                  <Share2 size={24} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortsCard;
