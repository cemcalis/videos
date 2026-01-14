import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { store } from "../../../data/store";

export default function AdminShortsPage() {
  return (
    <>
      <Topbar title="Shorts Yönetimi" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar" },
            { href: "/admin/videos", label: "Videolar" },
            { href: "/admin/shorts", label: "Shorts", active: true },
            { href: "/admin/categories", label: "Kategoriler" },
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Dikey shorts içerik yönetimi</h2>
            <p>Kısa videoları ekleyin, düzenleyin ve reklam alanlarını yönetin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Shorts Ekle</h3>
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
                  <input name="categoryId" placeholder="Kısa Videolar" />
                </label>
                <label>
                  Süre
                  <input name="duration" placeholder="0:42" />
                </label>
                <button className="button" type="button">
                  Shorts Ekle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Shorts Listesi</h3>
              <div className="list">
                {store.shorts.map((short) => (
                  <div key={short.id} className="list-item">
                    <div>
                      <strong>{short.title}</strong>
                      <div>{short.description}</div>
                      <small>{short.duration}</small>
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
      <footer>VideoHub Admin • Shorts</footer>
    </>
  );
}
