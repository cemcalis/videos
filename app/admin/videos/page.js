import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { formatNumber } from "../../../lib/format";
import { getCategories, getVideos } from "../../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function AdminVideosPage() {
  const [videos, categories] = await Promise.all([getVideos(), getCategories()]);

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
                  <select name="categoryId">
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Süre (sn)
                  <input name="duration" type="number" min="10" />
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
                {videos.map((video) => (
                {store.videos.map((video) => (
                  <div key={video.id} className="list-item">
                    <div>
                      <strong>{video.title}</strong>
                      <div>{video.description}</div>
                      <small>
                        {toDuration(video.durationSeconds)} • {video.category.name} • {video.uploader.name}
                      </small>
                      <small>{video.duration} • {video.category}</small>
                    </div>
                    <button className="button secondary" type="button">
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>Özet</h3>
              <div className="list">
                <div className="list-item">
                  <div>Toplam Video</div>
                  <strong>{formatNumber(videos.length)}</strong>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Videolar</footer>
    </>
  );
}
