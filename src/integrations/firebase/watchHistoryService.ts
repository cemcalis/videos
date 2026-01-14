import { db } from './client';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

export const addToWatchHistory = async (userId: string, videoId: string) => {
    if (!userId || !videoId) return;
    try {
        await addDoc(collection(db, 'watchHistory'), {
            userId,
            videoId,
            watchedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding to watch history:', error);
    }
};

export const getWatchHistory = async (userId: string, limitVal = 20) => {
    if (!userId) return [];
    try {
        const q = query(
            collection(db, 'watchHistory'),
            where('userId', '==', userId),
            orderBy('watchedAt', 'desc'),
            limit(limitVal)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting watch history:', error);
        return [];
    }
};
