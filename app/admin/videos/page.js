import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { store } from "../../../data/store";

export default function AdminVideosPage() {
  return (
    <>
      <Topbar title="Video Yönetimi" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar" },
            { href: "/admin/videos", label: "Videolar", active: true },
            { href: "/admin/shorts", label: "Shorts" },
            { href: "/admin/categories", label: "Kategoriler" },
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Video listesi ve içerik yönetimi</h2>
            <p>Video ekleyin, silin ve kategori ilişkilerini yönetin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Video Ekle</h3>
              <form className="form">
                <label>
                  Başlık
                  <input name="title" />
                </label>
                <label>
                  Açıklama
                  <textarea name="description" rows={2} />
                </label>
                <label>
                  Kategori
                  <input name="categoryId" placeholder="Teknoloji" />
                </label>
                <label>
                  Süre
                  <input name="duration" placeholder="12:34" />
                </label>
                <button className="button" type="button">
                  Video Ekle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Video Listesi</h3>
              <div className="list">
                {store.videos.map((video) => (
                  <div key={video.id} className="list-item">
                    <div>
                      <strong>{video.title}</strong>
                      <div>{video.description}</div>
                      <small>{video.duration} • {video.category}</small>
                    </div>
                    <button className="button secondary" type="button">
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Videolar</footer>
    </>
  );
}
