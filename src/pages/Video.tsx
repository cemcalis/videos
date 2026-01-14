import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";
import { useVideos } from "@/hooks/useVideos";
import VideoPlayer from "@/components/VideoPlayer";
import Comments from "@/components/Comments";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { addToWatchHistory } from "@/integrations/firebase/watchHistoryService";
import VideoActions from "@/components/VideoActions";
import Footer from "@/components/Footer";

const Video = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();

  // This would normally fetch a single video, but for now we'll use the videos hook
  const { videos } = useVideos();
  const video = videos.find(v => v.id === id);

  useEffect(() => {
    if (user && id) {
      addToWatchHistory(user.uid, id);
    }
  }, [user, id]);

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video bulunamadı</h1>
          <Button onClick={() => navigate("/")}>
            Ana sayfaya dön
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Bağlantı kopyalandı",
        description: "Video bağlantısı panoya kopyalandı.",
      });
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date));
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Geri
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <VideoPlayer
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  title={video.title}
                />
              </CardContent>
            </Card>

            {/* Video Info */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold leading-tight mb-2">
                        {video.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {formatViews(video.views)} görüntülenme
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {/* Comments count would come from comments hook */}
                        </div>
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="flex items-center gap-2"
                      >
                        <Share2 size={16} />
                        Paylaş
                      </Button>
                    </div>
                  </div>

                  {/* Tags and Category */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {typeof video.category === 'object' ? video.category.name : (video.category || "Genel")}
                    </Badge>
                    {video.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                    {video.isPremium && (
                      <Badge variant="default">Premium</Badge>
                    )}
                    {video.isShort && (
                      <Badge variant="secondary">Shorts</Badge>
                    )}
                  </div>

                  {/* Description */}
                  {video.description && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Açıklama</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Uploader Info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={video.uploader?.avatar || ""} />
                      <AvatarFallback>
                        {(video.uploader?.name || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{video.uploader?.name || "Anonim"}</p>
                      <p className="text-sm text-muted-foreground">Yayıncı</p>
                    </div>
                  </div>

                  {/* Like/Dislike Actions */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp size={16} />
                      <span>{video.likes}</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown size={16} />
                      <span>{video.dislikes}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Yorumlar</h2>
              </CardHeader>
              <CardContent>
                <Comments videoId={video.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Benzer Videolar</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos
                    .filter(v => v.id !== video.id && v.category === video.category)
                    .slice(0, 5)
                    .map((relatedVideo) => (
                      <div
                        key={relatedVideo.id}
                        className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => navigate(`/video/${relatedVideo.id}`)}
                      >
                        <img
                          src={relatedVideo.thumbnailUrl}
                          alt={relatedVideo.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {relatedVideo.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {relatedVideo.uploader?.name || "Anonim"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatViews(relatedVideo.views)} görüntülenme
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Video;
