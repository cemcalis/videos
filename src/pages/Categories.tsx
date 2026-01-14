import { useState } from "react";
import Header from "@/components/Header";
import CategoryPill from "@/components/CategoryPill";
import VideoCard from "@/components/VideoCard";
import { categories } from "@/data/mockData";
import { useVideos } from "@/hooks/useVideos";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const navigate = useNavigate();

  const { videos, loading } = useVideos({
    category: selectedCategory,
    limit: 40
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}B`;
    return views.toString();
  };

  const getDurationString = (duration: any) => {
    if (typeof duration === 'number') {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return duration || "0:00";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Kategoriler</h1>
            <p className="text-muted-foreground">
              İlgi alanlarınıza göre videoları keşfedin
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
            {categories.map((category) => (
              <CategoryPill
                key={category}
                name={category}
                isActive={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>

          {/* Results */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {selectedCategory} Kategorisi
            </h2>
            <p className="text-muted-foreground">
              {loading ? "Yükleniyor..." : `${videos.length} video bulundu`}
            </p>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Videolar yükleniyor...</p>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnailUrl}
                  duration={getDurationString(video.duration)}
                  views={formatViews(video.views)}
                  channel={video.uploader?.name || "Anonim"}
                  uploadedAt={formatDistanceToNow(video.createdAt, { addSuffix: true, locale: tr })}
                  onClick={() => navigate(`/video/${video.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Bulunamadı</h3>
              <p className="text-muted-foreground">
                Bu kategoride henüz video bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
