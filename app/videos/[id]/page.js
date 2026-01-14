import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { formatNumber } from "../../../lib/format";
import { getVideoById, getVideos } from "../../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function VideoDetailPage({ params }) {
  const [video, videos] = await Promise.all([getVideoById(params.id), getVideos()]);

  if (!video) {
    return (
      <>
        <Topbar title="Video Bulunamadı" />
        <main className="page">
          <div className="card">
            <h3>Video bulunamadı</h3>
            <p>Aradığınız video mevcut değil.</p>
          </div>
        </main>
      </>
    );
  }

  const relatedVideos = videos.filter((item) => item.id !== video.id).slice(0, 4);

  return (
    <>
      <Topbar title={video.title} />
      <div className="layout">
        <Sidebar
          title="Video Detay"
          links={[
            { href: "/videos", label: "Videolar" },
            { href: `/videos/${video.id}`, label: "Video Detay", active: true },
            { href: "/categories", label: "Kategoriler" },
            { href: "/shorts", label: "Shorts" }
          ]}
        />
        <main className="page">
          <section className="video-player">
            <div className="player-box">
              <span>Video Player</span>
              <strong>{toDuration(video.durationSeconds)}</strong>
            </div>
            <div className="video-info">
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              <div className="video-sub">
                <span>{video.uploader.name}</span>
                <span>•</span>
                <span>{formatNumber(video.views)} görüntülenme</span>
              </div>
              <div className="video-actions">
                <button type="button">Beğen ({formatNumber(video.likes.length)})</button>
                <button type="button">Paylaş</button>
                <button type="button">Kaydet</button>
              </div>
            </div>
          </section>

          <section className="section-grid" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Yorumlar</h3>
              <div className="comment-form">
                <input placeholder="Yorum yaz" />
                <button type="button">Gönder</button>
              </div>
              <div className="list">
                {video.comments.length === 0 ? (
                  <div className="list-item">
                    <div>Henüz yorum yok.</div>
                  </div>
                ) : (
                  video.comments.map((comment) => (
                    <div key={comment.id} className="list-item">
                      <div>
                        <strong>{comment.author.name}</strong>
                        <div>{comment.message}</div>
                        <small>{comment.createdAt.toLocaleString("tr-TR")}</small>
                      </div>
                      <button type="button" className="button secondary">
                        Yanıtla
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card">
              <h3>Benzer Videolar</h3>
              <div className="list">
                {relatedVideos.map((item) => (
                  <div key={item.id} className="list-item">
                    <div>
                      <strong>{item.title}</strong>
                      <div>{item.uploader.name}</div>
                      <small>{formatNumber(item.views)} görüntülenme</small>
                    </div>
                    <a className="button secondary" href={`/videos/${item.id}`}>
                      İzle
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub • Video Detay</footer>
    </>
  );
}
