// Firebase services utilities
import { auth, db, storage } from './client';
import { User } from 'firebase/auth';

export { auth, db, storage };

// Type for User with additional properties
export interface ExtendedUser extends User {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
}

// Helper function to get current user
export const getCurrentUser = (): ExtendedUser | null => {
  const user = auth.currentUser;
  return user ? (user as ExtendedUser) : null;
};
