"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "@firebase/auth";
import { auth, isFirebaseConfigured } from "./client";
import { AppUser, UserContextType, UserRole } from "@/types/user";

const AuthContext = createContext<UserContextType | undefined>(undefined);

const DEMO_CITIZEN: AppUser = {
  uid: "demo-citizen-101",
  email: "citizen.jane@example.com",
  displayName: "Jane Citizen",
  photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  role: "citizen",
};

const DEMO_ADMIN: AppUser = {
  uid: "demo-admin-901",
  email: "admin.alex@civicresolve.gov",
  displayName: "Alex Rivera (Public Works Dept)",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  role: "admin",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  // Check if email matches configured admin emails
  const checkIsAdmin = (email: string | null): boolean => {
    if (!email) return false;
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@civicresolve.gov,cityofficer@civicresolve.gov,admin.alex@civicresolve.gov";
    const list = adminEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
    return list.includes(email.toLowerCase());
  };

  useEffect(() => {
    // If Firebase Auth is not configured or in demo mode, check local storage
    if (!isFirebaseConfigured || !auth) {
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("civicresolve_demo_user") : null;
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(DEMO_CITIZEN);
        }
      } else {
        setUser(DEMO_CITIZEN);
      }
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    // Live Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const tokenResult = await fbUser.getIdTokenResult();
          const hasAdminClaim = Boolean(tokenResult.claims.admin);
          const isAdminByEmail = checkIsAdmin(fbUser.email);
          const role: UserRole = hasAdminClaim || isAdminByEmail ? "admin" : "citizen";

          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || "Citizen",
            photoURL: fbUser.photoURL,
            role,
          });
          setIsDemoMode(false);
        } catch (err) {
          console.error("Error fetching token claims:", err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || "Citizen",
            photoURL: fbUser.photoURL,
            role: checkIsAdmin(fbUser.email) ? "admin" : "citizen",
          });
        }
      } else {
        // Fall back to demo citizen if no active Firebase session in dev
        const savedDemo = localStorage.getItem("civicresolve_demo_user");
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo));
            setIsDemoMode(true);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    if (!isFirebaseConfigured || !auth) {
      // In demo mode, sign in with demo citizen
      setUser(DEMO_CITIZEN);
      localStorage.setItem("civicresolve_demo_user", JSON.stringify(DEMO_CITIZEN));
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const tokenResult = await fbUser.getIdTokenResult();
      const hasAdminClaim = Boolean(tokenResult.claims.admin);
      const isAdminByEmail = checkIsAdmin(fbUser.email);
      const role: UserRole = hasAdminClaim || isAdminByEmail ? "admin" : "citizen";

      const newUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || "Citizen",
        photoURL: fbUser.photoURL,
        role,
      };

      setUser(newUser);
      setIsDemoMode(false);
      localStorage.removeItem("civicresolve_demo_user");
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      // If popup was blocked or network error, provide friendly fallback
      alert("Google sign-in encountered an issue. Falling back to Demo Citizen mode.");
      setUser(DEMO_CITIZEN);
      localStorage.setItem("civicresolve_demo_user", JSON.stringify(DEMO_CITIZEN));
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (auth && isFirebaseConfigured) {
        await firebaseSignOut(auth);
      }
      localStorage.removeItem("civicresolve_demo_user");
      setUser(null);
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = (role: UserRole) => {
    const target = role === "admin" ? DEMO_ADMIN : DEMO_CITIZEN;
    setUser(target);
    setIsDemoMode(true);
    localStorage.setItem("civicresolve_demo_user", JSON.stringify(target));
  };

  const role: UserRole = user?.role || "citizen";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isAdmin,
        signInWithGoogle,
        signOut,
        switchDemoRole,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): UserContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
