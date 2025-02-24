import { useCallback } from 'react';
import { DefaultResource } from '@/lib';
import { WithResources } from '../../components/common/WithResources';
import { AgendaView } from '../AgendaView';
import { DayGrid } from './components/DayGrid';
import { filterMultiDaySlot, generateHourSlots, getResourcedEvents } from '../../helpers/generals';
import { dayjs } from '@/config/dayjs';
import useStore from '@/lib/hooks/useStore.ts';
import { MULTI_DAY_EVENT_HEIGHT } from '@/lib/helpers/constants.ts';
import { useDayEvents } from '@/lib/views/day/hooks/useDayEvents.ts';

export const Day = () => {
  const {
    selectedDate,
    resources,
    resourceViewMode,
    agenda,
    day,
    resourceFields,
    fields,
    timeZone,
  } = useStore();

  const selectedDayjs = dayjs(selectedDate);

  const { startHour, endHour, step } = day!;

  const startTime = selectedDayjs.hour(startHour).minute(0).second(0).toDate();
  const endTime = selectedDayjs.hour(endHour).minute(-step).second(0).toDate();

  const events = useDayEvents(startTime, endTime);

  const hours: Date[] = generateHourSlots(startTime, endTime, step);

  const renderContent = useCallback(
    (resource?: DefaultResource) => {
      let resourcedEvents = events;
      if (resource) {
        resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
      }

      const shouldEqualize = resources.length && resourceViewMode === 'default';
      const allWeekMulti = filterMultiDaySlot(
        shouldEqualize ? events : resourcedEvents,
        selectedDate,
        timeZone
      );
      const headerHeight = MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + 45;

      return agenda ? (
        <AgendaView view="day" events={resourcedEvents} />
      ) : (
        <DayGrid
          resource={resource}
          events={resourcedEvents}
          headerHeight={headerHeight}
          selectedDate={selectedDate}
          hours={hours}
          cellRenderer={day?.cellRenderer}
          headRenderer={day?.headRenderer}
          hourRenderer={day?.hourRenderer}
        />
      );
    },
    [
      events,
      resources.length,
      resourceViewMode,
      selectedDate,
      timeZone,
      agenda,
      hours,
      day?.cellRenderer,
      day?.headRenderer,
      day?.hourRenderer,
      resourceFields,
      fields,
    ]
  );

  return resources.length ? <WithResources renderChildren={renderContent} /> : renderContent();
};
