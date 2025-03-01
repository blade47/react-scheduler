import { memo } from 'react';
import MonthTable from '@/components/month/MonthTable.tsx';
import { DefaultResource } from '@/index.tsx';

interface Props {
  daysList: Date[];
  eachWeekStart: Date[];
  resource?: DefaultResource;
}

export const MonthGrid = memo(({ daysList, eachWeekStart, resource }: Props) => {
  return <MonthTable daysList={daysList} eachWeekStart={eachWeekStart} resource={resource} />;
});

MonthGrid.displayName = 'MonthGrid';
