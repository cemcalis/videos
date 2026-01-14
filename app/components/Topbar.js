import Link from "next/link";

export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        <span className="subtitle">VideoHub Studio</span>
      </div>
      <form className="search" action="/search" method="get">
        <input name="q" placeholder="Ara: video, kanal, kategori" />
        <button type="submit">Ara</button>
      </form>
      <nav>
        <Link href="/">Ana Sayfa</Link>
        <Link href="/categories">Kategoriler</Link>
        <Link href="/videos">Videolar</Link>
        <Link href="/shorts">Shorts</Link>
        <Link href="/admin">Admin Panel</Link>
      </nav>
    </header>
  );
}
