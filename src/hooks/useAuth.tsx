/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isWarden: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  ensureWardenSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isWarden, setIsWarden] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if user is in wardens collection
        const wardenRef = doc(db, 'wardens', user.uid);
        try {
          const wardenSnap = await getDoc(wardenRef);
          setIsWarden(wardenSnap.exists());
        } catch (e) {
          console.error("Error checking warden status:", e);
          setIsWarden(false);
        }
      } else {
        setIsWarden(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(user, { displayName: name });
    setUser({ ...user, displayName: name });
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Helper to make current user a warden for testing/demo purposes
  const ensureWardenSession = async () => {
    if (user && !isWarden) {
      await setDoc(doc(db, 'wardens', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Demo Warden'
      });
      setIsWarden(true);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isWarden, loading, signIn, signInEmail, signUpEmail, logout, ensureWardenSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
