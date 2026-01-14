import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { formatNumber } from "../../../lib/format";
import { getPayments } from "../../../lib/queries";

export default async function AdminPaymentsPage() {
  const payments = await getPayments();

import { store } from "../../../data/store";

export default function AdminPaymentsPage() {
  return (
    <>
      <Topbar title="Manuel Ödemeler" />
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
            { href: "/admin/users", label: "Kullanıcılar" },
            { href: "/admin/payments", label: "Ödemeler", active: true }
          ]}
        />
        <main className="page">
          <div className="page-header">
            <h2>IBAN ödeme talepleri</h2>
            <p>Manuel ödeme taleplerini inceleyin ve onaylayın.</p>
          </div>

          <section className="section-grid">
            <div className="card">
              <h3>Ödeme Talepleri</h3>
              <div className="list">
                {payments.map((payment) => (
                  <div key={payment.id} className="list-item">
                    <div>
                      <strong>{payment.user.name}</strong>
                      <div>{formatNumber(payment.amount)} TL • {payment.iban}</div>
                {store.payments.map((payment) => (
                  <div key={payment.id} className="list-item">
                    <div>
                      <strong>{payment.userId}</strong>
                      <div>{payment.amount} TL • {payment.iban}</div>
                      <small>Durum: {payment.status}</small>
                    </div>
                    <button className="button secondary" type="button">
                      Onayla
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>VideoHub Admin • Ödemeler</footer>
    </>
  );
}
