import { DragEvent } from 'react';
import { ProcessedEvent } from '@/index.tsx';
import useStore from './useStore.ts';

const useDragAttributes = (event: ProcessedEvent) => {
  const { setCurrentDragged } = useStore();
  return {
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      setCurrentDragged(event);
    },
    onDragEnd: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      setCurrentDragged();
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
  };
};

export default useDragAttributes;
