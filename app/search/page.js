import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { formatNumber } from "../../lib/format";
import { searchVideos } from "../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || "";
  const results = await searchVideos(query);

  return (
    <>
      <Topbar title="Arama" />
      <div className="layout">
        <Sidebar
          title="Arama"
          links={[
            { href: `/search?q=${query}`, label: "Sonuçlar", active: true },
            { href: "/videos", label: "Videolar" },
            { href: "/categories", label: "Kategoriler" },
            { href: "/shorts", label: "Shorts" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Arama sonuçları</h2>
            <p>"{query || "Tüm videolar"}" için {results.length} sonuç</p>
          </div>

          <section className="card">
            <div className="list">
              {results.length === 0 ? (
                <div className="list-item">Sonuç bulunamadı.</div>
              ) : (
                results.map((video) => (
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
                ))
              )}
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub • Arama</footer>
    </>
  );
}
