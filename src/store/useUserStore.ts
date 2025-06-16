import { create } from "zustand";

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  website: string | null;
};

type UserStore = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
};

export const useUesrStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

