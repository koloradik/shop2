import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  wishlist: number[];
};

type AuthStore = {
  isAuth: boolean;
  user: User | null;

  logout: () => void;
  login: (user: User) => void;

  updateAvatar: (avatar: string) => void;

  addProductToWishlist: (productId: number) => void;
  removeProductFromWishlist: (productId: number) => void;
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

      addProductToWishlist: (productId) =>
        set((state) => {
          if (state.user) {
            return {
              user: {
                ...state.user,
                wishlist: [...state.user.wishlist, productId],
              },
            };
          }
          return state;
        }),

      removeProductFromWishlist: (productId) =>
        set((state) => {
          if (state.user) {
            return {
              user: {
                ...state.user,
                wishlist: state.user.wishlist.filter((el) => el !== productId),
              },
            };
          }

          return state;
        }),
    }),
    { name: "auth" }
  )
);

export default useAuth;
