import { memo } from 'react';
import MonthTable from '@/lib/components/month/MonthTable.tsx';
import { DefaultResource } from '@/lib';

interface Props {
  daysList: Date[];
  eachWeekStart: Date[];
  resource?: DefaultResource;
}

export const MonthGrid = memo(({ daysList, eachWeekStart, resource }: Props) => {
  return <MonthTable daysList={daysList} eachWeekStart={eachWeekStart} resource={resource} />;
});

MonthGrid.displayName = 'MonthGrid';
