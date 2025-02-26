import { useCallback } from 'react';
import { DefaultResource } from '@/lib';
import { WithResources } from '../../components/common/WithResources';
import useStore from '../../hooks/useStore';
import { AgendaView } from '../agenda/AgendaView.tsx';
import { useWeekEvents } from './hooks/useWeekEvents';
import { WeekGrid } from './components/WeekGrid';
import {
  generateHourSlots,
  generateWeekDays,
  getResourcedEvents,
  getWeekBoundaries,
} from '../../helpers/generals';
import { dayjs } from '@/config/dayjs.ts';

export const Week = () => {
  const { selectedDate, resources, agenda, week, resourceFields, fields, minDate, maxDate } =
    useStore();

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

      return agenda ? (
        <AgendaView view="week" events={resourcedEvents} daysList={days} />
      ) : (
        <WeekGrid daysList={days} hours={hours} events={resourcedEvents} resource={resource} />
      );
    },
    [events, agenda, days, hours, resourceFields, fields]
  );

  return resources.length ? <WithResources renderChildren={renderContent} /> : renderContent();
};
