import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { getCategories } from "../../lib/queries";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Topbar title="Kategoriler" />
      <div className="layout">
        <Sidebar
          title="Kategoriler"
          links={[
            { href: "/categories", label: "Kategori Listesi", active: true },
            { href: "/videos", label: "Videolar" },
            { href: "/shorts", label: "Shorts" },
            { href: "/admin", label: "Admin Panel" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Video kategorileri</h2>
            <p>İçerik türlerine göre keşif yapın ve filtreleyin.</p>
          </div>

          <section className="section-grid">
            {categories.map((category) => (
              <div key={category.id} id={category.id} className="card">
                <h3>{category.name}</h3>
                <p>{category._count.videos} video • {category._count.shorts} shorts</p>
                <a className="button secondary" href={`/search?q=${category.name}`}>
                  Kategoride ara
                </a>
              </div>
            ))}
          </section>
        </main>
      </div>
      <footer>VideoHub • Kategoriler</footer>
    </>
  );
}
