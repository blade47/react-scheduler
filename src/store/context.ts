import { createContext } from 'react';
import { Store } from './types.ts';

export const StoreContext = createContext<Store | null>(null);
