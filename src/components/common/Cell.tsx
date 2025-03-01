import React, { memo } from 'react';
import { useCellAttributes } from '@/hooks/useCellAttributes.ts';
import dayjs from '@/config/dayjs.ts';
import { CellRenderedProps } from '@/types.ts';
import { CellButton } from '@/theme/css.ts';
import useStore from '@/hooks/useStore.ts';
import { isDateInRange } from '@/helpers/generals.tsx';

export interface Props {
  day: Date;
  start: Date;
  height: number;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  cellRenderer?(props: CellRenderedProps): React.ReactNode;
  children?: React.ReactNode;
}

const Cell = memo(
  ({ day, start, end, resourceKey, resourceVal, cellRenderer, height, children }: Props) => {
    const { minDate, maxDate } = useStore();

    const isOutsideAvailableRange = () => !isDateInRange(day, minDate, maxDate);
    const isDisabled = isOutsideAvailableRange();

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
      disabled: isDisabled,
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
        disabled={isDisabled}
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
