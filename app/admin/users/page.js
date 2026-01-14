import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { getUsers } from "../../../lib/queries";

export default async function AdminUsersPage() {
  const users = await getUsers();

import { store } from "../../../data/store";

export default function AdminUsersPage() {
  return (
    <>
      <Topbar title="Kullanıcı Yönetimi" />
      <div className="layout">
        <Sidebar
          title="Admin"
          links={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/seo", label: "SEO & Premium" },
            { href: "/admin/ads", label: "Reklamlar" },
            { href: "/admin/videos", label: "Videolar" },
            { href: "/admin/shorts", label: "Shorts" },
            { href: "/admin/categories", label: "Kategoriler" },
            { href: "/admin/users", label: "Kullanıcılar", active: true },
            { href: "/admin/payments", label: "Ödemeler" }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>Kullanıcı hesapları ve premium durumu</h2>
            <p>Premium aktivasyonu ve kullanıcı görünürlüğü burada.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Kullanıcı Listesi</h3>
              <div className="list">
                {users.map((user) => (
                {store.users.map((user) => (
                  <div key={user.id} className="list-item">
                    <div>
                      <strong>{user.name}</strong>
                      <div>{user.email}</div>
                      <small>Rol: {user.role}</small>
                    </div>
                    <button className="button secondary" type="button">
                      Rol Güncelle
                      <small>Premium: {user.premium ? "Aktif" : "Pasif"}</small>
                    </div>
                    <button className="button secondary" type="button">
                      Premium Aç
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Kullanıcılar</footer>
    </>
  );
}
