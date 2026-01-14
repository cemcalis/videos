import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { getSiteSetting } from "../../lib/queries";

export default async function AuthPage() {
  const setting = await getSiteSetting();

import { store } from "../../data/store";

export default function AuthPage() {
  return (
    <>
      <Topbar title="Kayıt ve Giriş" />
      <div className="layout">
        <Sidebar
          title="Üyelik"
          links={[
            { href: "/auth", label: "Kayıt / Giriş", active: true },
            { href: "/videos", label: "Videolar" },
            { href: "/shorts", label: "Shorts" },
            { href: "/admin", label: "Admin Panel" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Hesap yönetimi ve premium deneme</h2>
            <p>Kullanıcı kayıt, giriş ve manuel ödeme taleplerini yönetin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Kullanıcı Kayıt / Giriş</h3>
              <form className="form">
                <label>
                  Ad Soyad
                  <input name="name" placeholder="Adınız" />
                </label>
                <label>
                  E-posta
                  <input name="email" type="email" placeholder="mail@ornek.com" />
                </label>
                <div className="columns">
                  <button className="button" type="button">
                    Kayıt Ol
                  </button>
                  <button className="button secondary" type="button">
                    Giriş Yap
                  </button>
                </div>
              </form>
              <div className="badge" style={{ marginTop: 12 }}>
                Oturum açılmadı
              </div>
            </div>

            <div className="card">
              <h3>Premium Deneme</h3>
              <p>Reklamsız premium denemeyi hemen etkinleştirin.</p>
              <button className="button" type="button">
                {setting?.premiumTrialDays ?? 7} Gün Denemeyi Başlat
                {store.stats.premiumTrialDays} Gün Denemeyi Başlat
              </button>
            </div>

            <div className="card">
              <h3>Manuel IBAN Ödeme</h3>
              <p>Premium için IBAN ile ödeme talebi oluşturun.</p>
              <button className="button secondary" type="button">
                IBAN ile Ödeme Talebi
              </button>
              <p style={{ marginTop: 12, color: "#475569" }}>
                IBAN: Yönetim panelinden tanımlanır.
                <br />
                Hesap Adı: Yönetim panelinden tanımlanır.
                IBAN: {store.manualPayment.iban}
                <br />
                Hesap Adı: {store.manualPayment.accountName}
              </p>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Premium • Kullanıcı akışı</footer>
    </>
  );
}
