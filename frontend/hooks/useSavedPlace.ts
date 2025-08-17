import { create } from 'zustand';
import type { Place } from '../components/types/place';

/**
 * Django 기본키(id)는 number 라는 전제.
 * Place 타입도 id: number 로 맞춰두세요.
 */
type SavedState = {
  items: Place[];
  add: (p: Place) => void;
  remove: (id: number) => void;
  toggle: (p: Place) => void;
  isSaved: (id: number) => boolean;
};

export const useSavedPlaces = create<SavedState>((set, get) => ({
  items: [],

  add: (p: Place) =>
    set((s) =>
      s.items.some((x) => x.id === p.id) ? s : { items: [...s.items, p] }
    ),

  remove: (id: number) =>
    set((s) => ({
      items: s.items.filter((x) => x.id !== id),
    })),

  toggle: (p: Place) => {
    const { isSaved, add, remove } = get();
    isSaved(p.id) ? remove(p.id) : add(p);
  },

  isSaved: (id: number) => get().items.some((x) => x.id === id),
}));
