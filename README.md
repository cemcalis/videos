# VideoHub Premium Demo (Next.js)

YouTube benzeri video izleme deneyimi için hazırlanmış Next.js tabanlı demo proje. Bu sürüm gerçek veritabanı şeması, gerçek kullanıcı/rol modeli ve video/yorum/like ilişkileri ile tasarlanmıştır.

## Özellikler

- Gerçek veritabanı şeması (Prisma + PostgreSQL).
- Kullanıcı, admin, video, shorts, yorum, beğeni ve reklam ilişkileri.
- Arama, kategori, video detay, yorum ve like akışları.
- Admin paneli: SEO, reklam, kullanıcı, ödeme ve içerik yönetimi.
- Premium deneme ve manuel ödeme kayıtları.

## Kurulum

```bash
npm install
```

1. `.env.example` dosyasını `.env` olarak kopyalayın ve `DATABASE_URL` girin.
2. Veritabanını oluşturup migration çalıştırın:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. Uygulamayı başlatın:

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Demo Sayfalar

- Ana sayfa: `http://localhost:3000/`
- Kayıt/Giriş: `http://localhost:3000/auth`
- Videolar: `http://localhost:3000/videos`
- Video Detay: `http://localhost:3000/videos/<video-id>`
- Arama: `http://localhost:3000/search?q=video`
- Kategoriler: `http://localhost:3000/categories`
- Shorts: `http://localhost:3000/shorts`
- Admin panel: `http://localhost:3000/admin`
- Admin SEO: `http://localhost:3000/admin/seo`
- Admin Reklamlar: `http://localhost:3000/admin/ads`
- Admin Videolar: `http://localhost:3000/admin/videos`
- Admin Shorts: `http://localhost:3000/admin/shorts`
- Admin Kategoriler: `http://localhost:3000/admin/categories`
- Admin Kullanıcılar: `http://localhost:3000/admin/users`
- Admin Ödemeler: `http://localhost:3000/admin/payments`

> Not: UI katmanı gerçek veritabanına bağlıdır. Geliştirme ortamında örnek veri eklemek için Prisma seed önerilir.
