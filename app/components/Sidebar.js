import Link from "next/link";

export default function Sidebar({ title, links }) {
  return (
    <aside className="sidebar">
      <div className="brand">{title}</div>
      {links.map((link) => (
        <Link key={link.href} className={link.active ? "active" : ""} href={link.href}>
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
