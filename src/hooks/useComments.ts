import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  parentId?: string; // For nested replies
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    avatar: string;
  };
  replies?: Comment[];
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (videoId: string, content: string, parentId?: string) => Promise<string>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  dislikeComment: (commentId: string) => Promise<void>;
  loadReplies: (parentId: string) => Promise<Comment[]>;
}

export const useComments = (videoId?: string): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();

  const fetchComments = async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'comments'),
        where('videoId', '==', videoId),
        where('parentId', '==', null), // Only top-level comments
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const commentsData: Comment[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const comment: Comment = {
          id: docSnap.id,
          content: data.content,
          userId: data.userId,
          videoId: data.videoId,
          parentId: data.parentId,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };

        // Fetch user info
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId, 'profile', 'data'));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            comment.user = {
              name: userData.name || 'Unknown',
              avatar: userData.avatar || '',
            };
          }
        }

        // Load replies count (we'll load actual replies on demand)
        const repliesQuery = query(
          collection(db, 'comments'),
          where('parentId', '==', docSnap.id)
        );
        const repliesSnapshot = await getDocs(repliesQuery);
        comment.replies = repliesSnapshot.docs.map(replyDoc => ({
          id: replyDoc.id,
          ...replyDoc.data(),
          createdAt: replyDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: replyDoc.data().updatedAt?.toDate() || new Date(),
        })) as Comment[];

        commentsData.push(comment);
      }

      setComments(commentsData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (videoId: string, content: string, parentId?: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    if (!content.trim()) throw new Error('Comment content cannot be empty');

    try {
      const commentData = {
        content: content.trim(),
        userId: user.uid,
        videoId,
        parentId: parentId || null,
        likes: 0,
        dislikes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      // Refresh comments
      await fetchComments();

      return docRef.id;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      throw new Error('Yorum eklenirken bir hata oluştu');
    }
  };

  const updateComment = async (commentId: string, content: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    if (!content.trim()) throw new Error('Comment content cannot be empty');

    try {
      // Check if user owns the comment
      const commentDoc = await getDoc(doc(db, 'comments', commentId));
      if (!commentDoc.exists()) throw new Error('Yorum bulunamadı');

      const commentData = commentDoc.data();
      if (commentData?.userId !== user.uid) {
        throw new Error('Bu yorumu düzenleme yetkiniz yok');
      }

      await updateDoc(doc(db, 'comments', commentId), {
        content: content.trim(),
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, content: content.trim(), updatedAt: new Date() }
          : comment
      ));

    } catch (error: any) {
      console.error('Error updating comment:', error);
      throw new Error('Yorum güncellenirken bir hata oluştu');
    }
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if user owns the comment
      const commentDoc = await getDoc(doc(db, 'comments', commentId));
      if (!commentDoc.exists()) throw new Error('Yorum bulunamadı');

      const commentData = commentDoc.data();
      if (commentData?.userId !== user.uid) {
        throw new Error('Bu yorumu silme yetkiniz yok');
      }

      await deleteDoc(doc(db, 'comments', commentId));

      // Update local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));

    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw new Error('Yorum silinirken bir hata oluştu');
    }
  };

  const likeComment = async (commentId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if user already liked/disliked
      const reactionDoc = await getDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`));
      const existingReaction = reactionDoc.exists() ? reactionDoc.data() : null;

      if (existingReaction) {
        if (existingReaction.type === 'like') {
          // Remove like
          await deleteDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`));
          await updateDoc(doc(db, 'comments', commentId), {
            likes: increment(-1),
          });
        } else {
          // Change dislike to like
          await updateDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`), {
            type: 'like',
          });
          await updateDoc(doc(db, 'comments', commentId), {
            likes: increment(1),
            dislikes: increment(-1),
          });
        }
      } else {
        // Add new like
        await addDoc(collection(db, 'commentReactions'), {
          userId: user.uid,
          commentId,
          type: 'like',
          createdAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'comments', commentId), {
          likes: increment(1),
        });
      }

      // Update local state
      await fetchComments();

    } catch (error: any) {
      console.error('Error liking comment:', error);
      throw new Error('Beğeni işlemi başarısız');
    }
  };

  const dislikeComment = async (commentId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Similar logic to likeComment but for dislikes
      const reactionDoc = await getDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`));
      const existingReaction = reactionDoc.exists() ? reactionDoc.data() : null;

      if (existingReaction) {
        if (existingReaction.type === 'dislike') {
          // Remove dislike
          await deleteDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`));
          await updateDoc(doc(db, 'comments', commentId), {
            dislikes: increment(-1),
          });
        } else {
          // Change like to dislike
          await updateDoc(doc(db, 'commentReactions', `${user.uid}_${commentId}`), {
            type: 'dislike',
          });
          await updateDoc(doc(db, 'comments', commentId), {
            likes: increment(-1),
            dislikes: increment(1),
          });
        }
      } else {
        // Add new dislike
        await addDoc(collection(db, 'commentReactions'), {
          userId: user.uid,
          commentId,
          type: 'dislike',
          createdAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'comments', commentId), {
          dislikes: increment(1),
        });
      }

      // Update local state
      await fetchComments();

    } catch (error: any) {
      console.error('Error disliking comment:', error);
      throw new Error('Beğenmeme işlemi başarısız');
    }
  };

  const loadReplies = async (parentId: string): Promise<Comment[]> => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('parentId', '==', parentId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const replies: Comment[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const reply: Comment = {
          id: docSnap.id,
          content: data.content,
          userId: data.userId,
          videoId: data.videoId,
          parentId: data.parentId,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };

        // Fetch user info for replies
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId, 'profile', 'data'));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            reply.user = {
              name: userData.name || 'Unknown',
              avatar: userData.avatar || '',
            };
          }
        }

        replies.push(reply);
      }

      return replies;
    } catch (error: any) {
      console.error('Error loading replies:', error);
      throw new Error('Yanıtlar yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    loadReplies,
  };
};
