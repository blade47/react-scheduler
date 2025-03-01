import { useContext } from 'react';
import { PositionContext } from './context.ts';

const usePosition = () => {
  return useContext(PositionContext);
};

export default usePosition;
