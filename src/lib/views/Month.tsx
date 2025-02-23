import { useEffect, useCallback } from 'react';
import { CellRenderedProps, DayHours, DefaultResource } from '@/lib';
import { getResourcedEvents, sortEventsByTheEarliest } from '../helpers/generals';
import { WithResources } from '../components/common/WithResources';
import useStore from '../hooks/useStore';
import MonthTable from '../components/month/MonthTable';
import { dayjs } from '@/config/dayjs';
import type { Dayjs } from 'dayjs';
import { AgendaView } from '@/lib/views/AgendaView.tsx';

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface MonthProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

const Month = () => {
  const {
    month,
    selectedDate,
    events,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    agenda,
  } = useStore();

  const { weekStartOn, weekDays } = month!;

  const selectedDayjs = dayjs(selectedDate);
  const monthStartDayjs = selectedDayjs.startOf('month');
  const monthEndDayjs = selectedDayjs.endOf('month');

  const getWeeksInMonth = (start: Dayjs, end: Dayjs, weekStartsOn: number): Date[] => {
    const weeks: Date[] = [];
    let current = start.startOf('week').add(weekStartsOn, 'day');

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      weeks.push(current.toDate());
      current = current.add(1, 'week');
    }
    return weeks;
  };

  const eachWeekStart = getWeeksInMonth(monthStartDayjs, monthEndDayjs, weekStartOn);
  const daysList = weekDays.map((d) => dayjs(eachWeekStart[0]).add(d, 'day').toDate());

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);

      const startDate = dayjs(eachWeekStart[0]);
      const endDate = dayjs(eachWeekStart[eachWeekStart.length - 1]).add(daysList.length, 'day');

      const events = await getRemoteEvents!({
        start: startDate.toDate(),
        end: endDate.toDate(),
        view: 'month',
      });

      if (Array.isArray(events) && events.length > 0) {
        handleState(events, 'events');
      }
    } finally {
      triggerLoading(false);
    }
  }, [triggerLoading, eachWeekStart, daysList.length, getRemoteEvents, handleState]);

  useEffect(() => {
    if (typeof getRemoteEvents === 'function') {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderTable = useCallback(
    (resource?: DefaultResource) => {
      if (agenda) {
        let resourcedEvents = sortEventsByTheEarliest(events);
        if (resource) {
          resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
        }

        return <AgendaView view="month" events={resourcedEvents} />;
      }

      return <MonthTable daysList={daysList} eachWeekStart={eachWeekStart} resource={resource} />;
    },
    [agenda, daysList, eachWeekStart, events, fields, resourceFields]
  );

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Month };
