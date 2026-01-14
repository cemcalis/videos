import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { formatNumber } from "../../lib/format";
import { getAds, getCategories, getVideos } from "../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function VideosPage() {
  const [ads, videos, categories] = await Promise.all([
    getAds(),
    getVideos(),
    getCategories()
  ]);

  return (
    <>
      <Topbar title="Video Merkezi" />
      <div className="layout">
        <Sidebar
          title="Video Merkezi"
          links={[
            { href: "/videos", label: "Videolar", active: true },
            { href: "/categories", label: "Kategoriler" },
            { href: "/shorts", label: "Shorts" },
            { href: "/auth", label: "Kayıt / Giriş" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Video kataloğu</h2>
            <p>Videolar, kategoriler ve reklam slotları aynı ekranda.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Reklam Slotları</h3>
              <div className="list">
                {ads.map((slot) => (
                  <div key={slot.id} className="list-item">
                    <div>
                      <strong>
                        {slot.placement} ({slot.slot})
                      </strong>
                      <div>
                        {slot.size} • {slot.durationSeconds} sn
                      </div>
                    </div>
                    <span className="badge">{slot.id}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Videolar</h3>
              <div className="list">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={{
                      id: video.id,
                      title: video.title,
                      description: video.description,
                      duration: toDuration(video.durationSeconds),
                      channel: video.uploader.name,
                      views: formatNumber(video.views),
                      likes: video.likes.length
                    }}
                  />
                ))}
              </div>
            </div>
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
          </section>
        </main>
      </div>
      <footer>VideoHub Premium • Video listesi</footer>
    </>
  );
}
