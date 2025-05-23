import { useCallback } from 'react';
import { DefaultResource } from '@/index.tsx';
import { WithResources } from '../../components/common/WithResources.tsx';
import useStore from '../../hooks/useStore.ts';
import { AgendaView } from '../agenda/AgendaView.tsx';
import { useMonthEvents } from './hooks/useMonthEvents.ts';
import { MonthGrid } from './components/MonthGrid.tsx';
import {
  generateDays,
  generateMonthWeeks,
  getResourcedEvents,
  sortEventsByTheEarliest,
} from '../../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';

export const Month = () => {
  const { selectedDate, resources, resourceFields, fields, agenda, month } = useStore();

  const { weekStartOn, weekDays } = month!;

  const selectedDayjs = dayjs(selectedDate);
  const monthStart = selectedDayjs.startOf('month').toDate();
  const monthEnd = selectedDayjs.endOf('month').toDate();

  const weeks = generateMonthWeeks(monthStart, monthEnd, weekStartOn);
  const days = generateDays(weeks[0], weekDays);

  const events = useMonthEvents(weeks, days);

  const renderContent = useCallback(
    (resource?: DefaultResource) => {
      if (agenda) {
        let resourcedEvents = sortEventsByTheEarliest(events);
        if (resource) {
          resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
        }

        return <AgendaView view="month" events={resourcedEvents} />;
      }
      return <MonthGrid daysList={days} eachWeekStart={weeks} resource={resource} />;
    },
    [agenda, days, weeks, events, resourceFields, fields]
  );

  return resources.length ? <WithResources renderChildren={renderContent} /> : renderContent();
};
