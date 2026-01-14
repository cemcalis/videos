// Social features service for Firebase
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
  increment,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./client";
import type { Comment } from "./types";

export const socialService = {
  // Reactions (likes/dislikes)
  async setReaction(videoId: string, userId: string, reaction: 'like' | 'dislike' | null) {
    try {
      const reactionRef = doc(db, "reactions", `${videoId}_${userId}`);
      const reactionDoc = await getDoc(reactionRef);

      const videoRef = doc(db, "videos", videoId);
      const batch = writeBatch(db);

      if (reactionDoc.exists()) {
        const previousReaction = reactionDoc.data().type;

        if (reaction === null) {
          // Remove reaction
          batch.delete(reactionRef);
          if (previousReaction === 'like') {
            batch.update(videoRef, { likes: increment(-1) });
          } else if (previousReaction === 'dislike') {
            batch.update(videoRef, { dislikes: increment(-1) });
          }
        } else if (previousReaction !== reaction) {
          // Change reaction
          batch.update(reactionRef, {
            type: reaction,
            updatedAt: Timestamp.now(),
          });

          if (previousReaction === 'like') {
            batch.update(videoRef, {
              likes: increment(-1),
              dislikes: increment(1),
            });
          } else if (previousReaction === 'dislike') {
            batch.update(videoRef, {
              likes: increment(1),
              dislikes: increment(-1),
            });
          }
        }
      } else if (reaction) {
        // Add new reaction
        batch.set(reactionRef, {
          videoId,
          userId,
          type: reaction,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        if (reaction === 'like') {
          batch.update(videoRef, { likes: increment(1) });
        } else if (reaction === 'dislike') {
          batch.update(videoRef, { dislikes: increment(1) });
        }
      }

      await batch.commit();
    } catch (error) {
      console.error("Error setting reaction:", error);
      throw error;
    }
  },

  async getUserReaction(videoId: string, userId: string): Promise<'like' | 'dislike' | null> {
    try {
      const reactionRef = doc(db, "reactions", `${videoId}_${userId}`);
      const reactionDoc = await getDoc(reactionRef);

      if (reactionDoc.exists()) {
        return reactionDoc.data().type;
      }
      return null;
    } catch (error) {
      console.error("Error getting user reaction:", error);
      return null;
    }
  },

  // Bookmarks
  async toggleBookmark(videoId: string, userId: string, isBookmarked: boolean) {
    try {
      const bookmarkRef = doc(db, "bookmarks", `${videoId}_${userId}`);

      if (isBookmarked) {
        await addDoc(collection(db, "bookmarks"), {
          videoId,
          userId,
          createdAt: Timestamp.now(),
        });
      } else {
        const bookmarkDoc = await getDoc(bookmarkRef);
        if (bookmarkDoc.exists()) {
          await deleteDoc(bookmarkRef);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  },

  async isBookmarked(videoId: string, userId: string): Promise<boolean> {
    try {
      const bookmarkRef = doc(db, "bookmarks", `${videoId}_${userId}`);
      const bookmarkDoc = await getDoc(bookmarkRef);
      return bookmarkDoc.exists();
    } catch (error) {
      console.error("Error checking bookmark:", error);
      return false;
    }
  },

  async getUserBookmarks(userId: string, limitCount: number = 20) {
    try {
      const q = query(
        collection(db, "bookmarks"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const bookmarkIds: string[] = [];

      snapshot.forEach((doc) => {
        bookmarkIds.push(doc.data().videoId);
      });

      return bookmarkIds;
    } catch (error) {
      console.error("Error getting user bookmarks:", error);
      throw error;
    }
  },

  // Comments
  async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        ...commentData,
        likes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Update video comment count
      const videoRef = doc(db, "videos", commentData.videoId);
      await updateDoc(videoRef, {
        comments: increment(1),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async getComments(videoId: string, limitCount: number = 50) {
    try {
      const q = query(
        collection(db, "comments"),
        where("videoId", "==", videoId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const comments: Comment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Comment);
      });

      return comments;
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  },

  async deleteComment(commentId: string, videoId: string) {
    try {
      await deleteDoc(doc(db, "comments", commentId));

      // Update video comment count
      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        comments: increment(-1),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  async likeComment(commentId: string, userId: string, isLiked: boolean) {
    try {
      const likeRef = doc(db, "commentLikes", `${commentId}_${userId}`);
      const commentRef = doc(db, "comments", commentId);

      const batch = writeBatch(db);

      if (isLiked) {
        batch.set(likeRef, {
          commentId,
          userId,
          createdAt: Timestamp.now(),
        });
        batch.update(commentRef, { likes: increment(1) });
      } else {
        const likeDoc = await getDoc(likeRef);
        if (likeDoc.exists()) {
          batch.delete(likeRef);
          batch.update(commentRef, { likes: increment(-1) });
        }
      }

      await batch.commit();
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  },

  // Social stats
  async getVideoStats(videoId: string) {
    try {
      const [likesQuery, dislikesQuery, commentsQuery, bookmarksQuery] = await Promise.all([
        getDocs(query(collection(db, "reactions"), where("videoId", "==", videoId), where("type", "==", "like"))),
        getDocs(query(collection(db, "reactions"), where("videoId", "==", videoId), where("type", "==", "dislike"))),
        getDocs(query(collection(db, "comments"), where("videoId", "==", videoId))),
        getDocs(query(collection(db, "bookmarks"), where("videoId", "==", videoId))),
      ]);

      return {
        likes: likesQuery.size,
        dislikes: dislikesQuery.size,
        comments: commentsQuery.size,
        bookmarks: bookmarksQuery.size,
      };
    } catch (error) {
      console.error("Error getting video stats:", error);
      return { likes: 0, dislikes: 0, comments: 0, bookmarks: 0 };
    }
  },

  // User activity
  async getUserActivity(userId: string, limitCount: number = 20) {
    try {
      const [reactionsQuery, commentsQuery, bookmarksQuery] = await Promise.all([
        getDocs(query(collection(db, "reactions"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(limitCount))),
        getDocs(query(collection(db, "comments"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(limitCount))),
        getDocs(query(collection(db, "bookmarks"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(limitCount))),
      ]);

      return {
        reactions: reactionsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        comments: commentsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        bookmarks: bookmarksQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      };
    } catch (error) {
      console.error("Error getting user activity:", error);
      throw error;
    }
  },
};
