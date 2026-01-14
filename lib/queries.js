import { prisma } from "./db";

export const getSiteSetting = async () => {
  return prisma.siteSetting.findFirst();
};

export const getStats = async () => {
  const [videoCount, adCount, categoryCount, setting] = await Promise.all([
    prisma.video.count(),
    prisma.ad.count(),
    prisma.category.count(),
    getSiteSetting()
  ]);

  return {
    premiumTrialDays: setting?.premiumTrialDays ?? 7,
    activeAdSlots: adCount,
    categories: categoryCount,
    videos: videoCount
  };
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { videos: true, shorts: true } } }
  });
};

export const getAds = async () => {
  return prisma.ad.findMany({ orderBy: { createdAt: "desc" } });
};

export const getVideos = async () => {
  return prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      uploader: true,
      likes: true,
      ads: { include: { ad: true } }
    }
  });
};

export const getVideoById = async (id) => {
  return prisma.video.findUnique({
    where: { id },
    include: {
      category: true,
      uploader: true,
      comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
      likes: true,
      ads: { include: { ad: true } }
    }
  });
};

export const getShorts = async () => {
  return prisma.short.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, uploader: true }
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
};

export const getPayments = async () => {
  return prisma.manualPayment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });
};

export const searchVideos = async (query) => {
  if (!query) {
    return getVideos();
  }

  return prisma.video.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        { uploader: { name: { contains: query, mode: "insensitive" } } }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { category: true, uploader: true, likes: true }
  });
};
