import Link from "next/link";

export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>
      <nav>
        <Link href="/">Ana Sayfa</Link>
        <Link href="/auth">Kayıt / Giriş</Link>
        <Link href="/videos">Videolar</Link>
        <Link href="/shorts">Shorts</Link>
        <Link href="/admin">Admin Panel</Link>
      </nav>
    </header>
  );
}
