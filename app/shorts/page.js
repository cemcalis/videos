import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { store } from "../../data/store";

export default function ShortsPage() {
  return (
    <>
      <Topbar title="Shorts Akışı" />
      <div className="layout">
        <Sidebar
          title="Shorts"
          links={[
            { href: "/shorts", label: "Shorts Akışı", active: true },
            { href: "/videos", label: "Videolar" },
            { href: "/auth", label: "Kayıt / Giriş" },
            { href: "/admin", label: "Admin Panel" }
          ]}
        />
        <main className="page">
          <div className="short-hero">
            <h2>Dikey kaydırmalı shorts deneyimi</h2>
            <p>Reklam eklenebilir kısa içerikler için optimize edilmiş akış.</p>
          </div>
          <section className="shorts-container">
            {store.shorts.map((short) => (
              <article key={short.id} className="short-card">
                <div>
                  <h2>{short.title}</h2>
                  <p>{short.description}</p>
                </div>
                <div className="ad">
                  <strong>Reklam</strong>
                  <div>{short.ads.join(", ")}</div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
      <footer>VideoHub Shorts • Dikey kaydırmalı demo</footer>
    </>
  );
}
