import { create } from "zustand";

interface ShipmentsUIState {
  selectedId: string | null;
  searchQuery: string;
  setSelectedId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
}

export const useShipmentsStore = create<ShipmentsUIState>((set) => ({
  selectedId: null,
  searchQuery: "",
  setSelectedId: (id) => set({ selectedId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
