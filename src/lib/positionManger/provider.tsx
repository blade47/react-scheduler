import { useEffect, useState } from 'react';
import { PositionContext, PositionManagerState } from './context';
import useStore from '../hooks/useStore';
import { DefaultResource, FieldProps, ProcessedEvent, ResourceFields } from '@/lib';
import { getResourcedEvents, sortEventsByTheEarliest } from '../helpers/generals';
import { dayjs } from '@/config/dayjs';

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
  const slots: EventSlots = {};
  let position = 0;

  events.forEach((event) => {
    const eventDays = getEventDays(event.start, event.end);

    eventDays.forEach((day) => {
      const dayKey = dayjs(day).format('YYYY-MM-DD');

      if (slots[dayKey]) {
        const positions = Object.values(slots[dayKey]);
        while (positions.includes(position)) {
          position += 1;
        }
        slots[dayKey][event.event_id] = position;
      } else {
        slots[dayKey] = { [event.event_id]: position };
      }
    });

    position = 0;
  });

  return slots;
};

const setEventPositionsWithResources = (
  events: ProcessedEvent[],
  resources: DefaultResource[],
  rFields: ResourceFields,
  fields: FieldProps[]
): PositionManagerState['renderedSlots'] => {
  const sorted = sortEventsByTheEarliest(events);
  const slots: PositionManagerState['renderedSlots'] = {};

  if (resources.length) {
    resources.forEach((resource) => {
      const resourcedEvents = getResourcedEvents(sorted, resource, rFields, fields);
      slots[resource[rFields.idField]] = setEventPositions(resourcedEvents);
    });
  } else {
    slots.all = setEventPositions(sorted);
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
