import { create } from 'zustand';

export interface Supplement {
  id: number;
  name: string;
  timeToTake: string;
  isTaken: boolean;
}

interface SupplementStore {
  supplements: Record<string, Supplement[]>;
  addSupplement: (dateKey: string, supplement: Omit<Supplement, 'id'>) => void;
  toggleTaken: (dateKey: string, supplementId: number) => void;
  getSupplement: (dateKey: string) => Supplement[];
  removeSupplement: (dateKey: string, supplementId: number) => void;
}

export const useSupplementStore = create<SupplementStore>((set, get) => ({
  supplements: {},
  
  addSupplement: (dateKey, supplement) => set((state) => {
    const currentSupplements = state.supplements[dateKey] || [];
    const newId = currentSupplements.length > 0 
      ? Math.max(...currentSupplements.map(s => s.id)) + 1 
      : 1;
    
    return {
      supplements: {
        ...state.supplements,
        [dateKey]: [
          ...currentSupplements,
          { ...supplement, id: newId, isTaken: false }
        ]
      }
    };
  }),
  
  toggleTaken: (dateKey, supplementId) => set((state) => {
    const currentSupplements = state.supplements[dateKey] || [];
    
    return {
      supplements: {
        ...state.supplements,
        [dateKey]: currentSupplements.map(supplement => 
          supplement.id === supplementId 
            ? { ...supplement, isTaken: !supplement.isTaken } 
            : supplement
        )
      }
    };
  }),
  
  getSupplement: (dateKey) => {
    return get().supplements[dateKey] || [];
  },
  
  removeSupplement: (dateKey, supplementId) => set((state) => {
    const currentSupplements = state.supplements[dateKey] || [];
    
    return {
      supplements: {
        ...state.supplements,
        [dateKey]: currentSupplements.filter(supplement => supplement.id !== supplementId)
      }
    };
  })
}));
