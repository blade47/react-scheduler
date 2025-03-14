import { memo } from 'react';
import { DefaultResource, ProcessedEvent } from '@/index.tsx';
import { calcCellHeight, calcMinuteHeight } from '@/helpers/generals.tsx';
import useStore from '@/hooks/useStore.ts';
import DayTable from '@/components/day/DayTable.tsx';

interface Props {
  hours: Date[];
  events: ProcessedEvent[];
  resources: DefaultResource[];
  selectedDate: Date;
  headerHeight: number;
}

export const DayGrid = memo(({ hours, events, resources, selectedDate, headerHeight }: Props) => {
  const { height, day } = useStore();
  const { step } = day!;

  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);

  return (
    <DayTable
      resourcedEvents={events}
      resources={resources}
      hours={hours}
      cellHeight={CELL_HEIGHT}
      minutesHeight={MINUTE_HEIGHT}
      selectedDate={selectedDate}
      headerHeight={headerHeight}
    />
  );
});

DayGrid.displayName = 'DayGrid';
