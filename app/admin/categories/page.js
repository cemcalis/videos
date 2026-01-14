import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { getCategories } from "../../../lib/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Topbar title="Kategori Yönetimi" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar" },
            { href: "/admin/videos", label: "Videolar" },
            { href: "/admin/shorts", label: "Shorts" },
            { href: "/admin/categories", label: "Kategoriler", active: true },
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Video ve shorts kategorilerini yönetin</h2>
            <p>Yeni kategori ekleyin veya mevcut kategorileri kaldırın.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Kategori Ekle</h3>
              <form className="form">
                <label>
                  Kategori Adı
                  <input name="name" />
                </label>
                <button className="button" type="button">
                  Kategori Ekle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Kategori Listesi</h3>
              <div className="list">
                {categories.map((category) => (
                  <div key={category.id} className="list-item">
                    <div>
                      <strong>{category.name}</strong>
                      <small>
                        {category._count.videos} video • {category._count.shorts} shorts
                      </small>
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
      <footer>VideoHub Admin • Kategoriler</footer>
    </>
  );
}
