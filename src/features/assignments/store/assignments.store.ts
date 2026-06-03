import { create } from 'zustand';

interface AssignmentsUIState {
  selectedAssignmentId: string | null;
  selectedShipmentId: string | null;
  searchQuery: string;
  setSelectedAssignmentId: (id: string | null) => void;
  setSelectedShipmentId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
}

export const useAssignmentsStore = create<AssignmentsUIState>((set) => ({
  selectedAssignmentId: null,
  selectedShipmentId: null,
  searchQuery: '',
  setSelectedAssignmentId: (id) =>
    set({ selectedAssignmentId: id, selectedShipmentId: null }),
  setSelectedShipmentId: (id) => set({ selectedShipmentId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));