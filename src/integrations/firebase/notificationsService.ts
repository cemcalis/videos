// Notifications service for Firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./client";
import type { Notification } from "./types";

export const notificationsService = {
  // Create notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...notificationData,
        isRead: false,
        createdAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Get user notifications
  async getUserNotifications(userId: string, limitCount: number = 50) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const notifications: Notification[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notification);
      });

      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  },

  // Get unread notifications count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("isRead", "==", false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const docRef = doc(db, "notifications", notificationId);
      await updateDoc(docRef, {
        isRead: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("isRead", "==", false)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });

      await batch.commit();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId: string) {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Real-time notifications listener
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notification);
      });
      callback(notifications);
    });
  },

  // Notification types and helpers
  async notifyVideoUpload(uploaderId: string, videoId: string, videoTitle: string) {
    // This would typically notify followers, but for now we'll create a system notification
    try {
      await this.createNotification({
        userId: uploaderId,
        type: 'video_upload',
        title: 'Video Yükleme Başarılı',
        message: `"${videoTitle}" videosu başarıyla yüklendi ve yayınlandı.`,
        relatedId: videoId,
      });
    } catch (error) {
      console.error("Error creating video upload notification:", error);
    }
  },

  async notifyComment(videoOwnerId: string, commenterName: string, videoId: string, videoTitle: string) {
    if (videoOwnerId === commenterName) return; // Don't notify self

    try {
      await this.createNotification({
        userId: videoOwnerId,
        type: 'comment',
        title: 'Yeni Yorum',
        message: `${commenterName} videonuza yorum yaptı: "${videoTitle}"`,
        relatedId: videoId,
      });
    } catch (error) {
      console.error("Error creating comment notification:", error);
    }
  },

  async notifyLike(videoOwnerId: string, likerName: string, videoId: string, videoTitle: string) {
    if (videoOwnerId === likerName) return; // Don't notify self

    try {
      await this.createNotification({
        userId: videoOwnerId,
        type: 'like',
        title: 'Yeni Beğeni',
        message: `${likerName} videonuza beğeni gösterdi: "${videoTitle}"`,
        relatedId: videoId,
      });
    } catch (error) {
      console.error("Error creating like notification:", error);
    }
  },

  async notifySubscription(subscriberId: string, channelName: string) {
    try {
      await this.createNotification({
        userId: subscriberId,
        type: 'subscription',
        title: 'Yeni Abone',
        message: `${channelName} kanalına abone oldunuz.`,
        relatedId: subscriberId,
      });
    } catch (error) {
      console.error("Error creating subscription notification:", error);
    }
  },

  async createSystemNotification(userId: string, title: string, message: string) {
    try {
      await this.createNotification({
        userId,
        type: 'system',
        title,
        message,
      });
    } catch (error) {
      console.error("Error creating system notification:", error);
    }
  },
};
