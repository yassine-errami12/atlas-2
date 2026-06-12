import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminSession = {
  token: string | null;
  adminId: string | null;
  adminEmail: string | null;
  adminName: string | null;
  loginTime: number | null;
};

type AdminAuthState = AdminSession & {
  isAuthenticated: boolean;
  setSession: (session: Partial<AdminSession>) => void;
  clearSession: () => void;
  isSessionExpired: () => boolean;
};

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      adminId: null,
      adminEmail: null,
      adminName: null,
      loginTime: null,
      isAuthenticated: false,

      setSession: (session) => {
        set((state) => ({
          ...state,
          ...session,
          isAuthenticated: !!(session.token && session.adminId),
          loginTime: session.token ? Date.now() : state.loginTime,
        }));
      },

      clearSession: () => {
        set({
          token: null,
          adminId: null,
          adminEmail: null,
          adminName: null,
          loginTime: null,
          isAuthenticated: false,
        });
      },

      isSessionExpired: () => {
        const state = get();
        if (!state.loginTime) return true;
        return Date.now() - state.loginTime > SESSION_TIMEOUT;
      },
    }),
    { 
      name: "atlas-admin-auth",
      // Verify session on hydration
      onRehydrateStorage: () => (state) => {
        if (state && state.isSessionExpired()) {
          state.clearSession();
        }
      },
    }
  )
);
