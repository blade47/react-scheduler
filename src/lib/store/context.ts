import { createContext, useContext } from 'react';
import { Store } from './types';

const StoreContext = createContext<Store | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreContext };
