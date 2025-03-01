import { useCallback } from 'react';
import { DefaultResource } from '@/index.tsx';
import { WithResources } from '../../components/common/WithResources.tsx';
import useStore from '../../hooks/useStore.ts';
import { AgendaView } from '../agenda/AgendaView.tsx';
import { useWeekEvents } from './hooks/useWeekEvents.ts';
import { WeekGrid } from './components/WeekGrid.tsx';
import {
  filterMultiDaySlot,
  generateHourSlots,
  generateWeekDays,
  getResourcedEvents,
  getWeekBoundaries,
} from '../../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';
import { MULTI_DAY_EVENT_HEADER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from '@/helpers/constants.ts';

export const Week = () => {
  const {
    selectedDate,
    resources,
    agenda,
    week,
    resourceFields,
    fields,
    minDate,
    maxDate,
    resourceViewMode,
    timeZone,
  } = useStore();

  const { weekDays, startHour, endHour, step } = week!;

  const { weekStart, weekStartOn } = getWeekBoundaries(selectedDate, weekDays, minDate, maxDate);

  const days = generateWeekDays(weekStart, weekStartOn, weekDays, maxDate);

  const startTime = dayjs(weekStart).hour(startHour).minute(0).second(0).toDate();
  const endTime = dayjs(weekStart).hour(endHour).minute(-step).second(0).toDate();

  const hours = generateHourSlots(startTime, endTime, step);

  const events = useWeekEvents(weekStart, days);

  const renderContent = useCallback(
    (resource?: DefaultResource) => {
      let resourcedEvents = events;
      if (resource) {
        resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
      }

      const shouldEqualize = resources.length && resourceViewMode === 'default';
      const allWeekMulti = filterMultiDaySlot(
        shouldEqualize ? events : resourcedEvents,
        days,
        timeZone
      );
      const headerHeight =
        MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + MULTI_DAY_EVENT_HEADER_HEIGHT;

      return agenda ? (
        <AgendaView view="week" events={resourcedEvents} daysList={days} />
      ) : (
        <WeekGrid
          headerHeight={headerHeight}
          daysList={days}
          hours={hours}
          events={resourcedEvents}
          resource={resource}
        />
      );
    },
    [
      events,
      resources.length,
      resourceViewMode,
      days,
      timeZone,
      agenda,
      hours,
      resourceFields,
      fields,
    ]
  );

  return resources.length ? <WithResources renderChildren={renderContent} /> : renderContent();
};
