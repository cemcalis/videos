import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { getAds } from "../../../lib/queries";

export default async function AdminAdsPage() {
  const ads = await getAds();

  return (
    <>
      <Topbar title="Reklam Yönetimi" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar", active: true },
            { href: "/admin/videos", label: "Videolar" },
            { href: "/admin/shorts", label: "Shorts" },
            { href: "/admin/categories", label: "Kategoriler" },
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Reklam slotu, süre ve yerleşim kontrolü</h2>
            <p>Reklam yerleşimi, süre, boyut ve tıklama linklerini yönetin.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Reklam Ekle</h3>
              <form className="form">
                <label>
                  Reklam Adı
                  <input name="name" placeholder="Reklam adı" />
                </label>
                <label>
                  Slot
                  <select name="slot">
                    <option value="PRE_ROLL">Pre-roll</option>
                    <option value="MID_ROLL">Mid-roll</option>
                    <option value="OVERLAY">Overlay</option>
                  </select>
                </label>
                <label>
                  Süre (sn)
                  <input name="durationSeconds" type="number" min="1" />
                </label>
                <label>
                  Boyut
                  <input name="size" placeholder="16:9" />
                </label>
                <label>
                  Yerleşim
                  <select name="placement">
                    <option value="VIDEO">Video</option>
                    <option value="SHORTS">Shorts</option>
                  </select>
                </label>
                <label>
                  Tıklama Linki
                  <input name="clickUrl" type="url" />
                </label>
                <button className="button" type="button">
                  Reklam Ekle
                </button>
              </form>
            </div>
            <div className="card">
              <h3>Mevcut Reklamlar</h3>
              <div className="list">
                {ads.map((ad) => (
                  <div key={ad.id} className="list-item">
                    <div>
                      <strong>{ad.name}</strong>
                      <div>
                        {ad.placement} • {ad.slot} • {ad.size}
                      </div>
                      <small>{ad.durationSeconds} sn • {ad.clickUrl}</small>
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
      <footer>VideoHub Admin • Reklamlar</footer>
    </>
  );
}
