import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import VideoCard from "./components/VideoCard";
import { formatNumber } from "../lib/format";
import { getCategories, getStats, getVideos } from "../lib/queries";

export default async function HomePage() {
  const [stats, categories, videos] = await Promise.all([
    getStats(),
    getCategories(),
    getVideos()
  ]);
import { store } from "../data/store";

export default function HomePage() {
  const { stats } = store;

  return (
    <>
      <Topbar title="VideoHub Premium" />
      <div className="layout">
        <Sidebar
          title="Kısayollar"
          links={[
            { href: "/", label: "Genel Bakış", active: true },
            { href: "/search?q=trend", label: "Trend Videolar" },
            { href: "/categories", label: "Kategoriler" },
            { href: "/videos", label: "Videolar" },
            { href: "/shorts", label: "Shorts" }
            { href: "/auth", label: "Kayıt / Giriş" },
            { href: "/videos", label: "Videolar" },
            { href: "/shorts", label: "Shorts" },
            { href: "/admin", label: "Admin Panel" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Profesyonel video platformu demoları</h2>
            <p>Arama, kategori ve video detay akışlarıyla gerçek YouTube benzeri yapı.</p>
            <p>Premium deneme, manuel ödeme ve reklam yönetimi akışlarını keşfedin.</p>
          </div>

          <section className="stats">
            <div className="stat">
              <span>Premium Deneme</span>
              <strong>{stats.premiumTrialDays} Gün</strong>
            </div>
            <div className="stat">
              <span>Aktif Reklam Slotu</span>
              <strong>{formatNumber(stats.activeAdSlots)}</strong>
            </div>
            <div className="stat">
              <span>Video Kategorisi</span>
              <strong>{formatNumber(stats.categories)}</strong>
            </div>
            <div className="stat">
              <span>Toplam Video</span>
              <strong>{formatNumber(stats.videos)}</strong>
              <strong>{stats.activeAdSlots}</strong>
            </div>
            <div className="stat">
              <span>Video Kategorisi</span>
              <strong>{stats.categories}</strong>
            </div>
          </section>

          <section className="hero card" style={{ marginTop: 24 }}>
            <span className="badge">Reklamsız Premium Deneme</span>
            <h2>YouTube benzeri video izleme deneyimi</h2>
            <p>
              Gelişmiş kayıt/giriş, premium hesap, manuel IBAN ödemesi ve admin panelden reklam
              / SEO yönetimi için Next.js tabanlı çoklu sayfa akışları.
            </p>
            <div className="columns">
              <a className="button" href="/auth">
                Premium Deneme Başlat
              </a>
              <a className="button secondary" href="/admin">
                Yönetim Paneline Git
              </a>
            </div>
          </section>

          <section className="section-grid" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Kategoriler</h3>
              <div className="pill-grid">
                {categories.map((category) => (
                  <a key={category.id} className="pill" href={`/categories#${category.id}`}>
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Öne Çıkan Videolar</h3>
              <div className="list">
                {videos.slice(0, 3).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={{
                      id: video.id,
                      title: video.title,
                      description: video.description,
                      duration: `${Math.floor(video.durationSeconds / 60)}:${String(
                        video.durationSeconds % 60
                      ).padStart(2, "0")}`,
                      channel: video.uploader.name,
                      views: formatNumber(video.views),
                      likes: video.likes.length
                    }}
                  />
                ))}
              </div>
              <h3>Kullanıcı Akışları</h3>
              <p>Kayıt, giriş, premium deneme ve manuel IBAN ödeme talebi.</p>
              <a className="button" href="/auth">
                Kayıt / Giriş
              </a>
            </div>
            <div className="card">
              <h3>Video Merkezi</h3>
              <p>Video listesi, reklam slotları ve içerik öne çıkanları.</p>
              <a className="button" href="/videos">
                Videoları Gör
              </a>
            </div>
            <div className="card">
              <h3>Shorts Akışı</h3>
              <p>Dikey, kaydırmalı kısa video deneyimi ve reklamlara hazır alanlar.</p>
              <a className="button" href="/shorts">
                Shorts İzle
              </a>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Premium • Profesyonel demo</footer>
    </>
  );
}
