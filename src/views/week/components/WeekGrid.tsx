import { memo } from 'react';
import { DefaultResource, ProcessedEvent } from '@/index.tsx';
import WeekTable from '@/components/week/WeekTable.tsx';
import { calcCellHeight, calcMinuteHeight } from '@/helpers/generals.tsx';
import useStore from '@/hooks/useStore.ts';

interface Props {
  hours: Date[];
  events: ProcessedEvent[];
  resource?: DefaultResource;
  daysList: Date[];
  headerHeight: number;
}

export const WeekGrid = memo(({ hours, events, resource, daysList, headerHeight }: Props) => {
  const { height, week } = useStore();
  const { step } = week!;

  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);

  return (
    <WeekTable
      resourcedEvents={events}
      resource={resource}
      hours={hours}
      cellHeight={CELL_HEIGHT}
      minutesHeight={MINUTE_HEIGHT}
      daysList={daysList}
      headerHeight={headerHeight}
    />
  );
});

WeekGrid.displayName = 'WeekGrid';
