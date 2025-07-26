import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IUser } from '@/models';

import { MmkvStorage } from './mmkvStorage';

interface AuthStore {
  user: IUser;
  setAuthInfo: (userInfo: IUser) => void;
  logout: () => void;
}

const USER_DEFAULT_DATA = {
  userId: '',
  email: '',
  firstname: '',
  lastname: '',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _) => ({
      token: '',
      user: USER_DEFAULT_DATA,
      setAuthInfo: (userInfo: IUser) => {
        set({ user: userInfo });
        router.replace('/notes');
      },
      logout: () => {
        set({ user: USER_DEFAULT_DATA });
        router.replace('/login');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => MmkvStorage),
    }
  )
);
