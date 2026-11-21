export type UserRole = "citizen" | "admin";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isAnonymous?: boolean;
}

export interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  isDemoMode: boolean;
}
