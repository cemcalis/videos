// Firebase/Firestore types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isPremium: boolean;
  premiumExpiresAt: Date | null;
  videosWatched: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  isPremium: boolean;
  isShort: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
}

export interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  position: 'top' | 'sidebar' | 'inline' | 'bottom' | 'video-pre' | 'video-mid';
  duration: number; // in seconds
  isActive: boolean;
  impressions: number;
  clicks: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface WatchHistory {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: Date;
  watchDuration: number; // in seconds
  completed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'video_upload' | 'comment' | 'like' | 'subscription' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // videoId, userId, etc.
}
