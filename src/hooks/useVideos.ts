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
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/integrations/firebase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  uploaderId: string;
  isPremium: boolean;
  isShort: boolean;
  status: 'published' | 'processing' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  uploader?: {
    name: string;
    avatar: string;
  };
}

interface UseVideosReturn {
  videos: Video[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  uploadVideo: (videoData: VideoUploadData) => Promise<string>;
  updateVideo: (videoId: string, updates: Partial<Video>) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  likeVideo: (videoId: string) => Promise<void>;
  dislikeVideo: (videoId: string) => Promise<void>;
  watchVideo: (videoId: string) => Promise<void>;
  loadMore: () => void;
  refresh: () => void;
}

interface VideoUploadData {
  title: string;
  description: string;
  videoFile: File;
  thumbnailFile?: File;
  category: string;
  tags: string[];
  isPremium: boolean;
  isShort: boolean;
}

export const useVideos = (options?: {
  category?: string;
  uploaderId?: string;
  searchQuery?: string;
  sortBy?: 'createdAt' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
  isPremium?: boolean;
  isShort?: boolean;
  limit?: number;
}): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const { user } = useAuthContext();

  const {
    category,
    uploaderId,
    searchQuery,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isPremium,
    isShort,
    limit: pageLimit = 20,
  } = options || {};

  const fetchVideos = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, 'videos'),
        where('status', '==', 'published'),
        orderBy(sortBy, sortOrder),
        limit(pageLimit)
      );

      // Apply filters
      if (category && category !== "Tümü") {
        q = query(q, where('category', '==', category));
      }

      if (uploaderId) {
        q = query(q, where('uploaderId', '==', uploaderId));
      }

      if (isPremium !== undefined) {
        q = query(q, where('isPremium', '==', isPremium));
      }

      if (isShort !== undefined) {
        q = query(q, where('isShort', '==', isShort));
      }

      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const videoData: Video[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const video: Video = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Video;

        // Fetch uploader info
        if (data.uploaderId) {
          const uploaderDoc = await getDoc(doc(db, 'users', data.uploaderId, 'profile', 'data'));
          if (uploaderDoc.exists()) {
            const uploaderData = uploaderDoc.data();
            video.uploader = {
              name: uploaderData.name || 'Unknown',
              avatar: uploaderData.avatar || '',
            };
          }
        }

        videoData.push(video);
      }

      // Apply search filter if provided
      let filteredVideos = videoData;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredVideos = videoData.filter(video =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      setVideos(prev => loadMore ? [...prev, ...filteredVideos] : filteredVideos);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageLimit);

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (videoData: VideoUploadData): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Upload video file
      const videoFileName = `${Date.now()}_${videoData.videoFile.name}`;
      const videoRef = ref(storage, `videos/${user.uid}/${videoFileName}`);
      await uploadBytes(videoRef, videoData.videoFile);
      const videoUrl = await getDownloadURL(videoRef);

      // Upload thumbnail if provided
      let thumbnailUrl = '';
      if (videoData.thumbnailFile) {
        const thumbnailFileName = `${Date.now()}_${videoData.thumbnailFile.name}`;
        const thumbnailRef = ref(storage, `thumbnails/${user.uid}/${thumbnailFileName}`);
        await uploadBytes(thumbnailRef, videoData.thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      // Create video document
      const videoDoc = {
        title: videoData.title,
        description: videoData.description,
        videoUrl,
        thumbnailUrl,
        duration: 0, // Will be calculated after upload
        views: 0,
        likes: 0,
        dislikes: 0,
        category: videoData.category,
        tags: videoData.tags,
        uploaderId: user.uid,
        isPremium: videoData.isPremium,
        isShort: videoData.isShort,
        status: 'processing',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'videos'), videoDoc);

      // Refresh videos list
      refresh();

      return docRef.id;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      throw new Error('Video yüklenirken bir hata oluştu');
    }
  };

  const updateVideo = async (videoId: string, updates: Partial<Video>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.uploader;
      delete updateData.category;

      await updateDoc(doc(db, 'videos', videoId), updateData);

      // Update local state
      setVideos(prev => prev.map(video =>
        video.id === videoId
          ? { ...video, ...updates, updatedAt: new Date() }
          : video
      ));

    } catch (error: any) {
      console.error('Error updating video:', error);
      throw new Error('Video güncellenirken bir hata oluştu');
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Get video data first
      const videoDoc = await getDoc(doc(db, 'videos', videoId));
      if (!videoDoc.exists()) throw new Error('Video bulunamadı');

      const videoData = videoDoc.data();

      // Check if user owns the video
      if (videoData.uploaderId !== user.uid) {
        throw new Error('Bu videoyu silme yetkiniz yok');
      }

      // Delete video and thumbnail files from storage
      if (videoData.videoUrl) {
        const videoRef = ref(storage, videoData.videoUrl);
        await deleteObject(videoRef);
      }

      if (videoData.thumbnailUrl) {
        const thumbnailRef = ref(storage, videoData.thumbnailUrl);
        await deleteObject(thumbnailRef);
      }

      // Delete video document
      await deleteDoc(doc(db, 'videos', videoId));

      // Update local state
      setVideos(prev => prev.filter(video => video.id !== videoId));

    } catch (error: any) {
      console.error('Error deleting video:', error);
      throw new Error('Video silinirken bir hata oluştu');
    }
  };

  const likeVideo = async (videoId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if user already liked/disliked
      const reactionDoc = await getDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`));
      const existingReaction = reactionDoc.exists() ? reactionDoc.data() : null;

      if (existingReaction) {
        if (existingReaction.type === 'like') {
          // Remove like
          await deleteDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`));
          await updateDoc(doc(db, 'videos', videoId), {
            likes: increment(-1),
          });
        } else {
          // Change dislike to like
          await updateDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`), {
            type: 'like',
          });
          await updateDoc(doc(db, 'videos', videoId), {
            likes: increment(1),
            dislikes: increment(-1),
          });
        }
      } else {
        // Add new like
        await addDoc(collection(db, 'videoReactions'), {
          userId: user.uid,
          videoId,
          type: 'like',
          createdAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'videos', videoId), {
          likes: increment(1),
        });
      }

      // Update local state
      refresh();

    } catch (error: any) {
      console.error('Error liking video:', error);
      throw new Error('Beğeni işlemi başarısız');
    }
  };

  const dislikeVideo = async (videoId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Similar logic to likeVideo but for dislikes
      const reactionDoc = await getDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`));
      const existingReaction = reactionDoc.exists() ? reactionDoc.data() : null;

      if (existingReaction) {
        if (existingReaction.type === 'dislike') {
          // Remove dislike
          await deleteDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`));
          await updateDoc(doc(db, 'videos', videoId), {
            dislikes: increment(-1),
          });
        } else {
          // Change like to dislike
          await updateDoc(doc(db, 'videoReactions', `${user.uid}_${videoId}`), {
            type: 'dislike',
          });
          await updateDoc(doc(db, 'videos', videoId), {
            likes: increment(-1),
            dislikes: increment(1),
          });
        }
      } else {
        // Add new dislike
        await addDoc(collection(db, 'videoReactions'), {
          userId: user.uid,
          videoId,
          type: 'dislike',
          createdAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'videos', videoId), {
          dislikes: increment(1),
        });
      }

      // Update local state
      refresh();

    } catch (error: any) {
      console.error('Error disliking video:', error);
      throw new Error('Beğenmeme işlemi başarısız');
    }
  };

  const watchVideo = async (videoId: string) => {
    try {
      await updateDoc(doc(db, 'videos', videoId), {
        views: increment(1),
      });

      // Update local state
      setVideos(prev => prev.map(video =>
        video.id === videoId
          ? { ...video, views: video.views + 1 }
          : video
      ));

    } catch (error: any) {
      console.error('Error updating view count:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchVideos(true);
    }
  };

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    fetchVideos(false);
  };

  useEffect(() => {
    fetchVideos(false);
  }, [category, uploaderId, searchQuery, sortBy, sortOrder, isPremium, isShort]);

  return {
    videos,
    loading,
    error,
    hasMore,
    uploadVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    watchVideo,
    loadMore,
    refresh,
  };
};
