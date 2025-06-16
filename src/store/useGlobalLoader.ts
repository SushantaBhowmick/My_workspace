import {create} from 'zustand'


type LoaderState = {
  isLoading: boolean
  showLoader: () => void
  hideLoader: () => void
}


export const useGlobalLoader = create<LoaderState>((set) => ({
  isLoading: false,
  showLoader: () => set({ isLoading: true }),
  hideLoader: () => set({ isLoading: false }),
}))