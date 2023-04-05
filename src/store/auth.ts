import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar: string;
};

type AuthStore = {
  isAuth: boolean;
  user: User | null;

  logout: () => void;
  login: (user: User) => void;

  updateAvatar: (avatar: string) => void;
};

const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,

      logout: () => set({ isAuth: false, user: null }),
      login: (user: User) => set({ isAuth: true, user: user }),

      updateAvatar: (avatar) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatar } : state.user,
        })),
    }),
    { name: "auth" }
  )
);

export default useAuth;
