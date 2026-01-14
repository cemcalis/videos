# VideoHub Premium Demo (Next.js)

YouTube benzeri video izleme deneyimi için hazırlanmış Next.js tabanlı demo proje. Kullanıcı kayıt/giriş, premium deneme, manuel IBAN ödeme akışı, reklam yönetimi, SEO ayarları, video/shorts/kategori yönetimi ve admin paneli içerir.

## Özellikler

- Gelişmiş kayıt ve giriş akışı (demo UI).
- Premium hesap ve reklamsız deneme akışı.
- Manuel IBAN ödeme talebi + admin onayı.
- Reklam yönetimi (slot, süre, boyut, konum, tıklama linki).
- SEO ayarları ve premium deneme süresi kontrolü.
- Video ekleme/silme, video içi reklam yönetimi.
- Shorts akışı (dikey, kaydırmalı) ve reklam alanları.
- Admin panel için çoklu sayfa yönetim akışı.

## Kurulum

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Demo Sayfalar

- Ana sayfa: `http://localhost:3000/`
- Kayıt/Giriş: `http://localhost:3000/auth`
- Videolar: `http://localhost:3000/videos`
- Shorts: `http://localhost:3000/shorts`
- Admin panel: `http://localhost:3000/admin`
- Admin SEO: `http://localhost:3000/admin/seo`
- Admin Reklamlar: `http://localhost:3000/admin/ads`
- Admin Videolar: `http://localhost:3000/admin/videos`
- Admin Shorts: `http://localhost:3000/admin/shorts`
- Admin Kategoriler: `http://localhost:3000/admin/categories`
- Admin Kullanıcılar: `http://localhost:3000/admin/users`
- Admin Ödemeler: `http://localhost:3000/admin/payments`

> Not: Bu proje demo amaçlı statik veri kullanır. Gerçek uygulamada kalıcı veritabanı ve yetkilendirme gereklidir.
