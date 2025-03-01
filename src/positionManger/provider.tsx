import React, { useEffect, useState } from 'react';
import { PositionContext, PositionManagerState } from './context.ts';
import useStore from '../hooks/useStore.ts';
import { DefaultResource, FieldProps, ProcessedEvent, ResourceFields } from '@/index.tsx';
import { getResourcedEvents } from '../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';

interface Props {
  children: React.ReactNode;
}

interface EventSlots {
  [key: string]: {
    [eventId: string]: number;
  };
}

const getEventDays = (start: Date, end: Date): Date[] => {
  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);
  const dayCount = endDayjs.diff(startDayjs, 'day') + 1;

  return Array.from({ length: dayCount }, (_, i) => startDayjs.clone().add(i, 'day').toDate());
};

const setEventPositions = (events: ProcessedEvent[]): EventSlots => {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return dayjs(a.start).valueOf() - dayjs(b.start).valueOf();
  });

  const slots: EventSlots = {};

  sortedEvents.forEach((event) => {
    const eventDays = getEventDays(event.start, event.end);
    let position = 0;
    let found = false;

    while (!found) {
      found = true;

      for (const day of eventDays) {
        const dayKey = dayjs(day).format('YYYY-MM-DD');

        if (!slots[dayKey]) continue;

        if (Object.values(slots[dayKey]).includes(position)) {
          position++;
          found = false;
          break;
        }
      }
    }

    eventDays.forEach((day) => {
      const dayKey = dayjs(day).format('YYYY-MM-DD');
      if (!slots[dayKey]) slots[dayKey] = {};
      slots[dayKey][event.event_id] = position;
    });
  });

  return slots;
};

const setEventPositionsWithResources = (
  events: ProcessedEvent[],
  resources: DefaultResource[],
  rFields: ResourceFields,
  fields: FieldProps[]
): PositionManagerState['renderedSlots'] => {
  const slots: PositionManagerState['renderedSlots'] = {};

  if (resources.length) {
    resources.forEach((resource) => {
      const resourcedEvents = getResourcedEvents(events, resource, rFields, fields);
      slots[resource[rFields.idField]] = setEventPositions(resourcedEvents);
    });
  } else {
    slots.all = setEventPositions(events);
  }

  return slots;
};

export const PositionProvider = ({ children }: Props) => {
  const { events, resources, resourceFields, fields } = useStore();

  const [state, setState] = useState<PositionManagerState>(() => ({
    renderedSlots: setEventPositionsWithResources(events, resources, resourceFields, fields),
  }));

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      renderedSlots: setEventPositionsWithResources(events, resources, resourceFields, fields),
    }));
  }, [events, fields, resourceFields, resources]);

  const setRenderedSlot = (day: string, eventId: string, position: number, resourceId?: string) => {
    setState((prev) => {
      const targetResource = resourceId || 'all';
      const prevResourceSlots = prev.renderedSlots?.[targetResource] || {};
      const prevDaySlots = prevResourceSlots[day] || {};

      return {
        ...prev,
        renderedSlots: {
          ...prev.renderedSlots,
          [targetResource]: {
            ...prevResourceSlots,
            [day]: {
              ...prevDaySlots,
              [eventId]: position,
            },
          },
        },
      };
    });
  };

  return (
    <PositionContext.Provider
      value={{
        ...state,
        setRenderedSlot,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
};
