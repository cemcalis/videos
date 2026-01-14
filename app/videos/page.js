import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { store } from "../../data/store";

export default function VideosPage() {
  return (
    <>
      <Topbar title="Video Merkezi" />
      <div className="layout">
        <Sidebar
          title="Video Merkezi"
          links={[
            { href: "/videos", label: "Videolar", active: true },
            { href: "/shorts", label: "Shorts" },
            { href: "/auth", label: "Kayıt / Giriş" },
            { href: "/admin", label: "Admin Panel" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Video kataloğu ve reklam slotları</h2>
            <p>Video listesi, reklam yerleşimi ve süre yönetimi için görünüm.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Reklam Slotları</h3>
              <div className="list">
                {store.ads.map((slot) => (
                  <div key={slot.id} className="list-item">
                    <div>
                      <strong>{slot.placement} ({slot.slot})</strong>
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
                {store.videos.map((video) => (
                  <div key={video.id} className="list-item">
                    <div>
                      <strong>{video.title}</strong>
                      <div>{video.description}</div>
                      <small>Reklam: {video.ads.join(", ")}</small>
                    </div>
                    <span className="badge">{video.duration}</span>
                  </div>
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
