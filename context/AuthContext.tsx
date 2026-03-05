"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type User } from "firebase/auth";
import {
  onAuthChange,
  signInWithGoogle,
  signOut,
  getGoogleRedirectResult,
} from "@/lib/firebaseAuth";
import {
  upsertUserProfile,
  type UserProfile,
} from "@/lib/firestore/userService";
import { getSettingsFromFirestore } from "@/lib/firestore/settingsService";
import { useAnchorStore } from "@/store/useAnchorStore";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store setters for hydrating from Firestore
  const setTheme = useAnchorStore((s) => s.setTheme);
  const setActiveSoftSpace = useAnchorStore((s) => s.setActiveSoftSpace);
  const setSpaceAudioEnabled = useAnchorStore((s) => s.setSpaceAudioEnabled);
  const setSpaceAudioVolume = useAnchorStore((s) => s.setSpaceAudioVolume);
  const saveAffirmation = useAnchorStore((s) => s.saveAffirmation);
  const setUid = useAnchorStore((s) => s.setUid);

  // Hydrate Zustand store from Firestore user settings
  const hydrateStoreFromFirestore = useCallback(
    async (uid: string) => {
      try {
        const settings = await getSettingsFromFirestore(uid);
        if (settings.activeTheme) setTheme(settings.activeTheme);
        if (settings.activeSoftSpace)
          setActiveSoftSpace(settings.activeSoftSpace);
        if (settings.spaceAudioEnabled !== undefined) {
          setSpaceAudioEnabled(settings.spaceAudioEnabled);
        }
        if (settings.spaceAudioVolume !== undefined) {
          setSpaceAudioVolume(settings.spaceAudioVolume);
        }
        if (settings.savedAffirmations?.length) {
          settings.savedAffirmations.forEach((a) => saveAffirmation(a));
        }
      } catch (err) {
        console.error("SoftAnchor: Failed to hydrate settings", err);
      }
    },
    [
      setTheme,
      setActiveSoftSpace,
      setSpaceAudioEnabled,
      setSpaceAudioVolume,
      saveAffirmation,
    ]
  );

  const handleUserSignedIn = useCallback(
    async (firebaseUser: User) => {
      try {
        const userProfile = await upsertUserProfile(firebaseUser);
        setUser(firebaseUser);
        setProfile(userProfile);
        setUid(firebaseUser.uid);
        await hydrateStoreFromFirestore(firebaseUser.uid);
      } catch (err) {
        console.error("SoftAnchor: Profile setup error", err);
        setError("Something went gently wrong. Please try again 💛");
      }
    },
    [hydrateStoreFromFirestore, setUid]
  );

  // On mount: handle redirect result (mobile Google sign-in)
  useEffect(() => {
    getGoogleRedirectResult().then((redirectUser) => {
      if (redirectUser) {
        handleUserSignedIn(redirectUser);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        await handleUserSignedIn(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
        setUid(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [handleUserSignedIn, setUid]);

  const handleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Couldn't sign in right now. Want to try again? 💛");
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    setUid(null);
  }, [setUid]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isSigningIn,
        signIn: handleSignIn,
        signOut: handleSignOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook — throws if used outside AuthProvider
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
