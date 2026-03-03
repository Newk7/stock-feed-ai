import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, githubProvider, isFirebaseConfigured } from "../config/firebase";
import { api } from "../services/api";

interface DevUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: null;
  getIdToken: () => Promise<string>;
}

type AppUser = User | DevUser;

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  devMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEV_USER: DevUser = {
  uid: "dev-user-001",
  email: "dev@smartwire.local",
  displayName: "Dev User",
  photoURL: null,
  getIdToken: async () => "dev-token",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const devMode = !isFirebaseConfigured;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Dev mode: auto-login with dev user
      console.warn(
        "[SmartWire] Firebase not configured — running in dev mode with auto-login"
      );
      setUser(DEV_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await api.login({
            displayName: firebaseUser.displayName || undefined,
            photoUrl: firebaseUser.photoURL || undefined,
          });
        } catch (err) {
          console.error("Failed to sync user with backend:", err);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) return;
    await signInWithPopup(auth!, googleProvider);
  };

  const signInWithGithub = async () => {
    if (!isFirebaseConfigured) return;
    await signInWithPopup(auth!, githubProvider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured) return;
    await signInWithEmailAndPassword(auth!, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured) return;
    await createUserWithEmailAndPassword(auth!, email, password);
  };

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    await firebaseSignOut(auth!);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        devMode,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
