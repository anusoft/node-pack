// src/store/itemStore.ts
import { create } from 'zustand';
import { Item, getItems, createItem as apiCreateItem } from '@/lib/api';

interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (newItemData: { name: string; description?: string }) => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  addItem: async (newItemData) => {
    // No isLoading state change here to allow form's own submitting state to be primary feedback
    try {
      const newItem = await apiCreateItem(newItemData);
      set((state) => ({ items: [...state.items, newItem], error: null }));
    } catch (error) {
       set({ error: (error as Error).message }); // Set error state
       throw error; // Re-throw to be caught in the component form
    }
  },
}));
