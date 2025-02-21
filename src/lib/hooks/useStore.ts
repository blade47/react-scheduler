import { useContext } from 'react';
import { StoreContext } from '../store/context';
import { Store } from '@/lib/store/types.ts';

const useStore = (): Store => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default useStore;
