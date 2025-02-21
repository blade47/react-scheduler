import { useEffect, useCallback } from 'react';
import { CellRenderedProps, DayHours, DefaultResource } from '@/lib';
import { WeekDays } from './Month';
import { calcCellHeight, calcMinuteHeight, getResourcedEvents } from '../helpers/generals';
import { WithResources } from '../components/common/WithResources';
import useStore from '../hooks/useStore';
import { WeekAgenda } from './WeekAgenda';
import WeekTable from '../components/week/WeekTable';
import { dayjs } from '@/config/dayjs';
import type { Dayjs } from 'dayjs';

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    agenda,
  } = useStore();

  const { weekStartOn, weekDays, startHour, endHour, step } = week!;

  const selectedDayjs = dayjs(selectedDate);

  const weekStart = selectedDayjs.startOf('week').add(weekStartOn, 'day');

  const daysList = weekDays.map((d) => weekStart.add(d, 'day').clone().toDate());

  const weekEnd = dayjs(daysList[daysList.length - 1]).endOf('day');

  const START_TIME = selectedDayjs.hour(startHour).minute(0).second(0);
  const END_TIME = selectedDayjs.hour(endHour).minute(-step).second(0);

  const eachMinuteOfInterval = (start: Dayjs, end: Dayjs, stepMinutes: number): Date[] => {
    const result: Date[] = [];
    let current = start.clone();

    while (current.isBefore(end) || current.isSame(end)) {
      result.push(current.toDate());
      current = current.add(stepMinutes, 'minute');
    }
    return result;
  };

  const hours = eachMinuteOfInterval(START_TIME, END_TIME, step);

  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);

      const events = await getRemoteEvents!({
        start: weekStart.toDate(),
        end: weekEnd.toDate(),
        view: 'week',
      });

      if (Array.isArray(events)) {
        handleState(events, 'events');
      }
    } finally {
      triggerLoading(false);
    }
  }, [triggerLoading, getRemoteEvents, weekStart, weekEnd, handleState]);

  useEffect(() => {
    if (typeof getRemoteEvents === 'function') {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderTable = (resource?: DefaultResource) => {
    let resourcedEvents = events;
    if (resource) {
      resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    if (agenda) {
      return <WeekAgenda daysList={daysList} events={resourcedEvents} />;
    }

    return (
      <WeekTable
        resourcedEvents={resourcedEvents}
        resource={resource}
        hours={hours}
        cellHeight={CELL_HEIGHT}
        minutesHeight={MINUTE_HEIGHT}
        daysList={daysList}
      />
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Week };
