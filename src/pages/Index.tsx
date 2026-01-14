import { useState } from "react";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import CategoryPill from "@/components/CategoryPill";
import AdBanner from "@/components/AdBanner";
import PremiumBadge from "@/components/PremiumBadge";
import { mockVideos, mockShorts, categories, mockAds } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Play, Flame, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [isPremium] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header isPremium={isPremium} />
      
      <main className="pt-20 pb-8">
        {/* Top Ad Banner - Only for non-premium */}
        {!isPremium && (
          <div className="container mx-auto px-4 mb-6">
            <AdBanner 
              id={mockAds[0].id}
              imageUrl={mockAds[0].imageUrl}
              linkUrl={mockAds[0].linkUrl}
              position="top"
            />
          </div>
        )}

        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
            {categories.map((category) => (
              <CategoryPill
                key={category}
                name={category}
                isActive={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="lg:col-span-3">
              {/* Shorts Section */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Play size={16} className="text-primary-foreground" fill="currentColor" />
                    </div>
                    <h2 className="text-xl font-bold">Shorts</h2>
                  </div>
                  <Link to="/shorts" className="text-sm text-primary hover:underline">
                    Tümünü Gör
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {mockShorts.slice(0, 4).map((short) => (
                    <Link key={short.id} to="/shorts" className="group">
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-secondary">
                        <img 
                          src={short.thumbnail} 
                          alt={short.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-medium line-clamp-2">{short.title}</p>
                          <p className="text-[10px] text-muted-foreground">{short.views}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Trending Section */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={24} className="text-primary" />
                  <h2 className="text-xl font-bold">Trendler</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockVideos.slice(0, 3).map((video) => (
                    <VideoCard
                      key={video.id}
                      {...video}
                    />
                  ))}
                </div>
              </section>

              {/* Inline Ad - Only for non-premium */}
              {!isPremium && (
                <div className="mb-8">
                  <AdBanner 
                    id={mockAds[2].id}
                    imageUrl={mockAds[2].imageUrl}
                    linkUrl={mockAds[2].linkUrl}
                    position="inline"
                  />
                </div>
              )}

              {/* All Videos */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={24} className="text-primary" />
                  <h2 className="text-xl font-bold">Önerilen Videolar</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      {...video}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Premium Card */}
              {!isPremium && <PremiumBadge variant="card" />}

              {/* Sidebar Ad - Only for non-premium */}
              {!isPremium && (
                <AdBanner 
                  id={mockAds[1].id}
                  imageUrl={mockAds[1].imageUrl}
                  linkUrl={mockAds[1].linkUrl}
                  position="sidebar"
                />
              )}

              {/* Popular Channels */}
              <div className="hdyatak-card rounded-xl p-4">
                <h3 className="font-semibold mb-4">Popüler Kanallar</h3>
                <div className="space-y-3">
                  {["Film Dünyası", "GameMaster", "Tech Review TR"].map((channel) => (
                    <div key={channel} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">
                          {channel.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{channel}</p>
                        <p className="text-xs text-muted-foreground">120K abone</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
