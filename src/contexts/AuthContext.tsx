import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'admin' | 'user' | 'free';
  isPremium: boolean;
  videosWatched: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: Profile | null;
  loading: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: FirebaseUser | null; profile: Profile | null; error: any }>;
  signIn: (email: string, password: string) => Promise<{ user: FirebaseUser | null; profile: Profile | null; error: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', userId, 'profile', 'data'));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        return {
          id: userId,
          email: data.email || '',
          name: data.name || null,
          avatar: data.avatar || null,
          role: data.role || 'free',
          isPremium: data.isPremium || false,
          videosWatched: data.videosWatched || 0,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        } as Profile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser, displayName?: string): Promise<void> => {
    try {
      const profileData = {
        email: firebaseUser.email || '',
        name: displayName || firebaseUser.displayName || null,
        avatar: firebaseUser.photoURL || null,
        role: 'free' as const,
        isPremium: false,
        videosWatched: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid, 'profile', 'data'), {
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setProfile({
        id: firebaseUser.uid,
        ...profileData,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      await createUserProfile(userCredential.user, displayName);
      const userProfile = await fetchUserProfile(userCredential.user.uid);
      return { user: userCredential.user, profile: userProfile, error: null };
    } catch (error: any) {
      return { user: null, profile: null, error: error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await fetchUserProfile(userCredential.user.uid);
      if (userProfile) {
        setProfile(userProfile);
      }
      return { user: userCredential.user, profile: userProfile, error: null };
    } catch (error: any) {
      return { user: null, profile: null, error: error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Remove id and sensitive from updates
      delete updateData.id;
      delete updateData.email;
      delete updateData.createdAt;

      await updateDoc(doc(db, 'users', user.uid, 'profile', 'data'), updateData);

      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const refetchProfile = async () => {
    if (user) {
      const updatedProfile = await fetchUserProfile(user.uid);
      setProfile(updatedProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        let userProfile = await fetchUserProfile(firebaseUser.uid);

        if (!userProfile) {
          // Create profile if it doesn't exist (e.g. first login)
          await createUserProfile(firebaseUser);
          userProfile = await fetchUserProfile(firebaseUser.uid);
        }

        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isPremium: profile?.isPremium || false,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    refetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

