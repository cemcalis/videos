import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import CategoryPill from "@/components/CategoryPill";
import AdBanner from "@/components/AdBanner";
import PremiumBadge from "@/components/PremiumBadge";
import Footer from "@/components/Footer";
import { mockVideos, mockShorts, categories, mockAds } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { Play, Flame, TrendingUp, Eye, Crown } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useVideos } from "@/hooks/useVideos";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const { isPremium } = useAuthContext();
  const navigate = useNavigate();

  // Use Firebase videos instead of mock data
  const { videos: allVideos, loading: videosLoading } = useVideos({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 20
  });

  const { videos: shortsVideos } = useVideos({
    isShort: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 8
  });

  // Filter videos by category
  const filteredVideos = activeCategory === "Tümü"
    ? allVideos.filter(video => !video.isShort)
    : allVideos.filter(video =>
      video.category === activeCategory && !video.isShort
    );


  // Hardcoded categories for consistent UI
  const categoriesList = ["Tümü", "Aksiyon", "Romantik", "Drama", "Komedi", "Belgesel"];

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Futuristic Category Navigation */}
          <div className="flex items-center gap-4 mb-14 pb-2 overflow-x-auto scrollbar-hide animate-cinematic-in">
            <div className="flex-none flex items-center gap-2">
              {categoriesList.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-8 py-3 rounded-2xl text-[11px] font-black transition-all duration-500 tracking-[0.2em] uppercase border
                    ${activeCategory === category
                      ? "bg-primary text-white border-primary hdyatak-glow-red scale-105"
                      : "bg-white/[0.02] text-muted-foreground border-white/5 hover:text-foreground hover:bg-white/5 hover:border-white/10"}
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Main Content Grid */}
            <div className="lg:col-span-3 space-y-12">
              {/* Shorts Experience */}
              <section className="animate-cinematic-in [animation-delay:200ms]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center hdyatak-glow-red rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Play size={20} className="text-white fill-current" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter uppercase">Shorts</h2>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase">Hızlı & Akıcı</p>
                    </div>
                  </div>
                  <Link to="/shorts" className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
                    Tümünü Gör
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {shortsVideos.map((short) => (
                    <div key={short.id} className="group aspect-[9/16] rounded-2xl overflow-hidden bg-white/[0.03] relative border border-white/5 hdyatak-card hover:scale-[1.02] transition-all duration-500">
                      <img
                        src={short.thumbnailUrl}
                        alt={short.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-sm font-black line-clamp-2 tracking-tight mb-1">
                          {short.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-white/60 font-bold uppercase tracking-tighter">
                          <Eye size={10} className="text-primary" />
                          {short.views} İzlenme
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cinematic Video Grid */}
              <section className="animate-cinematic-in [animation-delay:400ms]">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp size={28} className="text-primary animate-pulse" />
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">
                      Keşfet <span className="text-primary">/</span> {activeCategory}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium tracking-tight">Sizin için özenle seçilmiş en yeni içerikler.</p>
                  </div>
                </div>

                {videosLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-video rounded-3xl bg-white/[0.03] animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        thumbnail={video.thumbnailUrl}
                        duration={typeof video.duration === 'number' ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "0:00"}
                        views={video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}B` : video.views.toString()}
                        channel={video.uploader?.name || "Anonim"}
                        uploadedAt={formatDistanceToNow(video.createdAt, { addSuffix: true, locale: tr })}
                        onClick={() => navigate(`/video/${video.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-80 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-muted-foreground bg-white/[0.01]">
                    <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                      <Play size={40} className="opacity-20 translate-x-1" />
                    </div>
                    <p className="font-black tracking-widest uppercase text-xs opacity-40">Henüz içerik bulunmuyor</p>
                  </div>
                )}
              </section>

              {/* Premium Ad Placement */}
              {!isPremium && (
                <div className="animate-cinematic-in [animation-delay:500ms]">
                  <AdBanner
                    id={mockAds[2].id}
                    imageUrl={mockAds[2].imageUrl}
                    linkUrl={mockAds[2].linkUrl}
                    position="sidebar"
                  />
                </div>
              )}
            </div>

            {/* Elite Sidebar Experience */}
            <aside className="lg:col-span-1 space-y-10 animate-cinematic-in [animation-delay:600ms]">
              {/* Premium Upsell Card */}
              {!isPremium && (
                <div className="group p-8 rounded-[32px] bg-gradient-to-br from-hdyatak-gold/20 via-hdyatak-gold/5 to-transparent border border-hdyatak-gold/20 hdyatak-glow-gold relative overflow-hidden transition-all duration-700 hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-hdyatak-gold/10 blur-[80px] group-hover:bg-hdyatak-gold/30 transition-all duration-500" />
                  <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hdyatak-gold to-orange-500 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6">
                      <Crown className="text-black" size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-none hdyatak-premium-text">Elite Pass</h3>
                      <p className="text-[10px] text-hdyatak-gold font-bold tracking-[0.3em] uppercase">Sınırları Zorlayın</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Reklamsız 4K deneyimi, özel içerikler ve topluluk ayrıcalıkları sizi bekliyor.
                    </p>
                    <Link to="/premium" className="w-full py-4 rounded-2xl bg-hdyatak-gold text-black font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:brightness-110 active:scale-95 shadow-xl shadow-hdyatak-gold/20">
                      Deneyimi Başlat
                    </Link>
                  </div>
                </div>
              )}

              {/* Sidebar Ad Slot */}
              {!isPremium && (
                <div className="rounded-[32px] overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity duration-500">
                  <AdBanner
                    id={mockAds[1].id}
                    imageUrl={mockAds[1].imageUrl}
                    linkUrl={mockAds[1].linkUrl}
                    position="sidebar"
                  />
                </div>
              )}

              {/* Cinematic Channel Rankings */}
              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-black tracking-tighter uppercase text-sm">Top Kanallar</h3>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="space-y-6">
                  {["Film Dünyası", "GameMaster", "Tech Review"].map((channel, i) => (
                    <div key={channel} className="flex items-center gap-4 group cursor-pointer">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 group-hover:rotate-3">
                          <span className="text-lg font-black tracking-tighter text-primary">{channel.charAt(0)}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-white/10 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-black tracking-tight truncate group-hover:text-primary transition-colors">{channel}</p>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">120K Abone</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
