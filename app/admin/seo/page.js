import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { store } from "../../../data/store";

export default function AdminSeoPage() {
  return (
    <>
      <Topbar title="SEO & Premium Ayarları" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium", active: true },
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
            <h2>SEO, premium deneme ve manuel ödeme ayarları</h2>
            <p>Arama görünürlüğü ve premium akışlarını buradan kontrol edin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>SEO & Premium Ayarları</h3>
              <form className="form">
                <label>
                  Başlık
                  <input defaultValue={store.seo.title} name="title" />
                </label>
                <label>
                  Açıklama
                  <textarea defaultValue={store.seo.description} name="description" rows={3} />
                </label>
                <label>
                  Anahtar Kelimeler
                  <input defaultValue={store.seo.keywords.join(", ")} name="keywords" />
                </label>
                <label>
                  Premium Deneme (gün)
                  <input defaultValue={store.stats.premiumTrialDays} name="trial" type="number" />
                </label>
                <button className="button" type="button">
                  Güncelle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Manuel IBAN Ödeme</h3>
              <form className="form">
                <label>
                  IBAN
                  <input defaultValue={store.manualPayment.iban} name="iban" />
                </label>
                <label>
                  Hesap Adı
                  <input defaultValue={store.manualPayment.accountName} name="accountName" />
                </label>
                <button className="button" type="button">
                  Kaydet
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • SEO Ayarları</footer>
    </>
  );
}
