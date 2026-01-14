import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const VideoPlayer = ({
  src,
  poster,
  title,
  className,
  autoPlay = false,
  muted = false,
  onTimeUpdate,
  onEnded
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onTimeUpdate, onEnded]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black rounded-3xl overflow-hidden group shadow-2xl border border-white/5", className)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        className="w-full h-full object-contain cursor-none group-hover:cursor-default"
        onClick={togglePlay}
      />

      {/* Cinematic Pulse when Toggling */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {!isPlaying && !isLoading && (
          <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping opacity-20" />
        )}
      </div>

      {/* Loading Spinner - Elite Style */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin hdyatak-glow-red" />
        </div>
      )}

      {/* Play Button Overlay (when paused) - Cinematic Style */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-500">
          <div
            className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center hdyatak-glow-red hover:scale-110 active:scale-90 transition-all duration-500 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          >
            <Play size={40} className="ml-2 text-white fill-current" />
          </div>
        </div>
      )}

      {/* Multi-Layered Controls Area */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-6 flex flex-col gap-4 transition-all duration-700 ease-in-out",
          showControls ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent -z-10 h-40 mt-[-100px]" />

        {/* Progress System */}
        <div className="relative group/progress h-1 mb-2">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full relative z-10 cursor-pointer hdyatak-slider-premium"
          />
          {/* Custom Buffer bar or phantom progress can be added here */}
        </div>

        {/* Control Bar - Glassmorphic Elite */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-6">
            {/* Main Primary Control */}
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 hdyatak-glass"
            >
              {isPlaying ? <Pause size={24} className="text-white fill-current" /> : <Play size={24} className="text-white fill-current ml-1" />}
            </button>

            {/* Navigation controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => skip(-10)} className="p-2 text-white/70 hover:text-white transition-colors"><SkipBack size={18} /></button>
              <button onClick={() => skip(10)} className="p-2 text-white/70 hover:text-white transition-colors"><SkipForward size={18} /></button>
            </div>

            {/* Volume Elite */}
            <div className="flex items-center gap-4 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-white/70 hover:text-white transition-all transform hover:scale-110"
              >
                {isMuted ? <VolumeX size={20} className="text-primary" /> : <Volume2 size={20} />}
              </button>
              <div className="w-0 group-hover/volume:w-24 transition-all duration-500 overflow-hidden">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-24 py-2"
                />
              </div>
            </div>

            {/* Time Indicator - Mono Style */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs font-bold tracking-tighter">
              <span className="text-primary">{formatTime(currentTime)}</span>
              <span className="text-white/20">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Resolution/Settings Toggle */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <Settings size={18} className="text-white/70" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">4K</span>
            </button>

            {/* Fullscreen - Deep Impact */}
            <button
              onClick={toggleFullscreen}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all duration-500 group/fs"
            >
              <Maximize size={20} className="text-white transition-transform duration-500 group-hover/fs:rotate-12" />
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic Title/Branding Overlay */}
      {title && (
        <div className={cn(
          "absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent transition-all duration-700",
          showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}>
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-1 max-w-2xl">
              <h2 className="text-2xl font-black tracking-tighter text-white drop-shadow-2xl line-clamp-2 uppercase">
                {title}
              </h2>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-md bg-primary text-[9px] font-black uppercase tracking-widest text-white">Elite Hub</div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Cinema Grade Playback</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
