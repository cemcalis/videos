export const store = {
  stats: {
    premiumTrialDays: 7,
    activeAdSlots: 2,
    categories: 2
  },
  ads: [
    {
      id: "ad_1",
      name: "Premium Deneme",
      slot: "pre-roll",
      durationSeconds: 12,
      size: "16:9",
      placement: "video",
      clickUrl: "https://example.com/premium"
    },
    {
      id: "ad_2",
      name: "Shorts Kampanya",
      slot: "overlay",
      durationSeconds: 6,
      size: "9:16",
      placement: "shorts",
      clickUrl: "https://example.com/shorts"
    }
  ],
  videos: [
    {
      id: "vid_1",
      title: "Yeni Nesil Platform Tanıtımı",
      description: "Premium deneme, reklamsız izleme ve admin panel demoları.",
      category: "Teknoloji",
      duration: "12:34",
      ads: ["pre-roll"]
    }
  ],
  shorts: [
    {
      id: "short_1",
      title: "Hızlı İpucu",
      description: "Dikey kaydırmalı kısa içerik.",
      duration: "0:42",
      ads: ["overlay"]
    }
  ],
  categories: [
    { id: "cat_1", name: "Teknoloji" },
    { id: "cat_2", name: "Kısa Videolar" }
  ],
  users: [
    { id: "user_1", name: "Demo User", email: "demo@platform.local", premium: false }
  ],
  payments: [
    {
      id: "pay_1",
      userId: "user_1",
      amount: 199,
      iban: "TR00 0000 0000 0000 0000 0000 00",
      status: "pending"
    }
  ],
  seo: {
    title: "VideoHub Premium",
    description: "Reklamsız premium deneme ve gelişmiş yönetim paneli.",
    keywords: ["video", "premium", "shorts", "reklam"]
  },
  manualPayment: {
    iban: "TR00 1111 2222 3333 4444 5555 66",
    accountName: "VideoHub Medya A.S.",
    enabled: true
  }
};
