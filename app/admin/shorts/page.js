import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { formatNumber } from "../../../lib/format";
import { getCategories, getShorts } from "../../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function AdminShortsPage() {
  const [shorts, categories] = await Promise.all([getShorts(), getCategories()]);

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
                </label>
                <button className="button" type="button">
                  Shorts Ekle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Shorts Listesi</h3>
              <div className="list">
                {shorts.map((short) => (
                  <div key={short.id} className="list-item">
                    <div>
                      <strong>{short.title}</strong>
                      <div>{short.description}</div>
                      <small>
                        {toDuration(short.durationSeconds)} • {short.category.name} • {short.uploader.name}
                      </small>
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
                  <div>Toplam Shorts</div>
                  <strong>{formatNumber(shorts.length)}</strong>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Shorts</footer>
    </>
  );
}
