import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { formatNumber } from "../../lib/format";
import { getShorts } from "../../lib/queries";

const toDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

export default async function ShortsPage() {
  const shorts = await getShorts();

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
            { href: "/categories", label: "Kategoriler" },
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
            {shorts.map((short) => (
            {store.shorts.map((short) => (
              <article key={short.id} className="short-card">
                <div>
                  <h2>{short.title}</h2>
                  <p>{short.description}</p>
                  <small>
                    {short.uploader.name} • {short.category.name} • {toDuration(short.durationSeconds)}
                  </small>
                </div>
                <div className="ad">
                  <strong>Reklam</strong>
                  <div>{formatNumber(1)} slot aktif</div>
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
