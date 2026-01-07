import { create } from "zustand"

type UIState = {
  mobileMenuOpen: boolean

  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}))
