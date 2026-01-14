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
      className="group cursor-pointer animate-cinematic-in"
      onClick={onClick}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/[0.02] mb-4 border border-white/5 hdyatak-card glass-reflection">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Elite Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Play Icon with Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 hdyatak-glow-red">
            <Play size={28} className="text-white ml-1 animate-pulse" fill="currentColor" />
          </div>
        </div>

        {/* Duration Elite Badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 text-[11px] font-black tracking-widest flex items-center gap-1.5 shadow-2xl transition-transform duration-500 group-hover:scale-110">
          <Clock size={12} className="text-primary" />
          <span className="text-white">{duration}</span>
        </div>

        {/* Live Indicator Placeholder or View Count inside image */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-primary/20 backdrop-blur-xl border border-primary/30 text-[9px] font-black uppercase tracking-tighter text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
          HD PREMIUM
        </div>
      </div>

      <div className="space-y-2 px-1">
        <h3 className="font-bold text-[15px] leading-tight text-foreground/90 line-clamp-2 group-hover:text-primary transition-all duration-300 tracking-tight">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]">
            {channel}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              <Eye size={12} className="text-primary" />
              <span className="text-white/80">{views}</span>
            </div>
            <span className="uppercase tracking-widest text-[9px] font-black opacity-40 ml-1">{uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
