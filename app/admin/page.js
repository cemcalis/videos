import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

export default function AdminPage() {
  return (
    <>
      <Topbar title="Admin Panel" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard", active: true },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar" },
            { href: "/admin/videos", label: "Videolar" },
            { href: "/admin/shorts", label: "Shorts" },
            { href: "/admin/categories", label: "Kategoriler" },
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Yönetim paneli genel bakış</h2>
            <p>SEO, reklam, kullanıcı ve içerik akışlarını ayrı sayfalardan yönetin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>SEO & Premium Ayarları</h3>
              <p>Başlık, açıklama, anahtar kelimeler ve premium deneme süresi.</p>
              <a className="button" href="/admin/seo">
                SEO Ayarları
              </a>
            </div>
            <div className="card">
              <h3>Reklam Yönetimi</h3>
              <p>Reklam slotu, süre, boyut ve tıklama linkleri.</p>
              <a className="button" href="/admin/ads">
                Reklamlar
              </a>
            </div>
            <div className="card">
              <h3>Video Yönetimi</h3>
              <p>Video ekleme, silme ve video içi reklam ilişkileri.</p>
              <a className="button" href="/admin/videos">
                Videolar
              </a>
            </div>
            <div className="card">
              <h3>Shorts Yönetimi</h3>
              <p>Dikey shorts içerikleri ve reklam alanları.</p>
              <a className="button" href="/admin/shorts">
                Shorts
              </a>
            </div>
            <div className="card">
              <h3>Kategori Yönetimi</h3>
              <p>Kategori ekleme ve silme işlemleri.</p>
              <a className="button" href="/admin/categories">
                Kategoriler
              </a>
            </div>
            <div className="card">
              <h3>Kullanıcı Yönetimi</h3>
              <p>Premium aktivasyon ve kullanıcı listesi.</p>
              <a className="button" href="/admin/users">
                Kullanıcılar
              </a>
            </div>
            <div className="card">
              <h3>Manuel Ödemeler</h3>
              <p>IBAN ödeme talepleri ve onay akışı.</p>
              <a className="button" href="/admin/payments">
                Ödemeler
              </a>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Çoklu sayfa yönetim</footer>
    </>
  );
}
