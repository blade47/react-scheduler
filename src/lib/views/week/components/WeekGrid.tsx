import { memo } from 'react';
import { DefaultResource, ProcessedEvent } from '@/lib';
import WeekTable from '@/lib/components/week/WeekTable.tsx';
import { calcCellHeight, calcMinuteHeight } from '@/lib/helpers/generals.tsx';
import useStore from '@/lib/hooks/useStore.ts';

interface Props {
  hours: Date[];
  events: ProcessedEvent[];
  resource?: DefaultResource;
  daysList: Date[];
}

export const WeekGrid = memo(({ hours, events, resource, daysList }: Props) => {
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
    />
  );
});

WeekGrid.displayName = 'WeekGrid';
