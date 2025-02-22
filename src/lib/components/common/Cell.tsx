import { memo } from 'react';
import { useCellAttributes } from '../../hooks/useCellAttributes';
import dayjs from '@/config/dayjs';
import { CellProps } from '@/lib/types.ts';
import { CellButton } from '@/lib/theme/css.ts';

const Cell = memo(
  ({ day, start, end, resourceKey, resourceVal, cellRenderer, height, children }: CellProps) => {
    const formatDateRange = (start: Date, end: Date): string => {
      const startDayjs = dayjs(start);
      const endDayjs = dayjs(end);
      const format = 'dddd, MMMM D, YYYY h:mm:ss A z';

      return `${startDayjs.format(format)} - ${endDayjs.format(format)}`;
    };

    const isCurrent = (start: Date, end: Date): boolean => {
      const now = dayjs();
      return now.isBetween(start, end, 'minute', '[]');
    };

    const cellAttributes = useCellAttributes({
      start,
      end,
      resourceKey,
      resourceVal,
    });

    const isCurrentTimeSlot = isCurrent(start, end);

    if (cellRenderer) {
      return cellRenderer({
        day,
        start,
        end,
        height,
        ...cellAttributes,
      });
    }

    return (
      <CellButton
        fullWidth
        aria-label={formatDateRange(start, end)}
        className={isCurrentTimeSlot ? 'current' : ''}
        sx={{ height }}
        {...cellAttributes}
      >
        {children}
      </CellButton>
    );
  }
);

Cell.displayName = 'Cell';

export default Cell;
