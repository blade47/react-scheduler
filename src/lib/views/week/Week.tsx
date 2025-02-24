import { useCallback } from 'react';
import { DefaultResource } from '@/lib';
import { WithResources } from '../../components/common/WithResources';
import useStore from '../../hooks/useStore';
import { AgendaView } from '../AgendaView';
import { useWeekEvents } from './hooks/useWeekEvents';
import { WeekGrid } from './components/WeekGrid';
import { generateHourSlots, generateWeekDays, getResourcedEvents } from '../../helpers/generals';
import { dayjs } from '@/config/dayjs.ts';

export const Week = () => {
  const { selectedDate, resources, agenda, week, resourceFields, fields } = useStore();

  const { weekStartOn, weekDays, startHour, endHour, step } = week!;

  const selectedDayjs = dayjs(selectedDate);

  const startTime = selectedDayjs.hour(startHour).minute(0).second(0).toDate();
  const endTime = selectedDayjs.hour(endHour).minute(-step).second(0).toDate();

  const days = generateWeekDays(selectedDate, weekStartOn, weekDays);
  const hours = generateHourSlots(startTime, endTime, step);

  const events = useWeekEvents(selectedDate, days);

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
