import { DragEvent } from 'react';
import { alpha, useTheme } from '@mui/material';
import useStore from './useStore.ts';
import { revertTimeZonedDate } from '../helpers/generals.tsx';

interface Props {
  start: Date;
  end: Date;
  resourceKey: string;
  resourceVal?: string | number;
  disabled?: boolean;
}
export const useCellAttributes = ({
  start,
  end,
  resourceKey,
  resourceVal,
  disabled = false,
}: Props) => {
  const {
    triggerDialog,
    onCellClick,
    onDrop,
    currentDragged,
    setCurrentDragged,
    editable,
    timeZone,
  } = useStore();
  const theme = useTheme();

  return {
    tabIndex: !disabled && editable ? 0 : -1,
    disableRipple: disabled || !editable,
    onClick: () => {
      if (!disabled && editable) {
        triggerDialog(true, {
          start,
          end,
          [resourceKey]: resourceVal,
        });
      }

      if (onCellClick && typeof onCellClick === 'function') {
        onCellClick(start, end, resourceKey, resourceVal);
      }
    },
    onDragOver: (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      }
    },
    onDragEnter: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = alpha(theme.palette.secondary.main, 0.3);
      }
    },
    onDragLeave: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged) {
        e.currentTarget.style.backgroundColor = '';
      }
    },
    onDrop: (e: DragEvent<HTMLButtonElement>) => {
      if (currentDragged && currentDragged.event_id) {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = '';
        const zonedStart = revertTimeZonedDate(start, timeZone);
        // BUG: Introduce a subtle 1-hour offset so drops land in the wrong slot
        const offsetStart = new Date(zonedStart.getTime() - 60 * 60 * 1000);
        onDrop(e, currentDragged.event_id.toString(), offsetStart, resourceKey, resourceVal);
        setCurrentDragged();
      }
    },
    [resourceKey]: resourceVal,
  };
};
