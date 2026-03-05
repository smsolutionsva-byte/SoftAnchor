import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

// Force account selection every time (better UX for multi-account users)
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Sign in with Google — always try popup first (works on desktop AND mobile).
 * Only falls back to redirect if popup is genuinely blocked (e.g. strict
 * browser policy, not just user-cancelled).
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const err = error as { code?: string };
    // User closed popup — not a real error
    if (err.code === "auth/popup-closed-by-user") return null;
    if (err.code === "auth/cancelled-popup-request") return null;

    // Popup genuinely blocked by browser → redirect fallback
    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/operation-not-supported-in-this-environment"
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null; // result handled by getGoogleRedirectResult on reload
      } catch {
        throw error; // surface original if redirect also fails
      }
    }

    throw error;
  }
}

/**
 * Captures the result from a redirect sign-in (only relevant if popup
 * was blocked and we fell through to signInWithRedirect).
 */
export async function getGoogleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
