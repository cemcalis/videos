import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { useVideos } from "@/hooks/useVideos";
import { Search as SearchIcon, Loader2, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Footer from "@/components/Footer";

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const navigate = useNavigate();

    const { videos, loading } = useVideos({
        searchQuery: query,
        limit: 40
    });

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 animate-cinematic-in">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                <SearchIcon className="text-primary hdyatak-glow-red" size={20} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase">
                                Arama <span className="text-primary">/</span> <span className="text-muted-foreground">{query}</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium tracking-tight ml-14">"{query}" için en iyi eşleşen sonuçlar gösteriliyor.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-video rounded-3xl bg-white/[0.03] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : videos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-cinematic-in [animation-delay:200ms]">
                            {videos.map((video) => (
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
                        <div className="h-96 rounded-[48px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center px-6 bg-white/[0.01] animate-cinematic-in">
                            <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] flex items-center justify-center mb-8 rotate-3">
                                <SearchIcon size={40} className="text-muted-foreground opacity-20" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Sonuç Bulunamadı</h3>
                            <p className="text-muted-foreground max-w-md font-medium leading-relaxed">
                                Aramanızla eşleşen bir içerik bulamadık. Kelimelerinizi gözden geçirmeyi veya popüler kategorilere göz atmayı deneyin.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-8 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Search;
