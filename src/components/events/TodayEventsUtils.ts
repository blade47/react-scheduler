import { dayjs } from '@/config/dayjs.ts';
import { BORDER_HEIGHT } from '@/helpers/constants.ts';
import { ProcessedEvent } from '@/types.ts';

export interface EventDimensionsProps {
  event: ProcessedEvent;
  startHour: number;
  minuteHeight: number;
  maxHeight: number;
}

export const calculateEventDimensions = ({
  event,
  startHour,
  minuteHeight,
  maxHeight,
}: EventDimensionsProps) => {
  const eventStart = dayjs(event.start);
  const eventEnd = dayjs(event.end);
  const calendarStartInMins = startHour * 60;

  // Calculate event dimensions
  const eventHeight = eventEnd.diff(eventStart, 'minute') * minuteHeight;
  const height = Math.min(eventHeight, maxHeight) - BORDER_HEIGHT;

  const eventStartInMins = eventStart.hour() * 60 + eventStart.minute();
  const minutesFromTop = Math.max(eventStartInMins - calendarStartInMins, 0);

  // Calculate positioning
  const top = minutesFromTop * minuteHeight;
  const slots = height / 60;
  const heightBorderFactor = slots * BORDER_HEIGHT;

  return {
    height: height + heightBorderFactor,
    top,
  };
};

export interface EventPositionProps {
  event: ProcessedEvent;
  crossingEvents: ProcessedEvent[];
  alreadyRendered: ProcessedEvent[];
  direction: 'rtl' | 'ltr';
}

export const calculateEventPosition = ({
  crossingEvents,
  alreadyRendered,
  direction,
}: EventPositionProps) => {
  const width =
    alreadyRendered.length > 0 ? `calc(100% - ${100 - 98 / (alreadyRendered.length + 1)}%)` : '98%';

  const position =
    alreadyRendered.length > 0
      ? `${(100 / (crossingEvents.length + 1)) * alreadyRendered.length}%`
      : '';

  return {
    width,
    [direction === 'rtl' ? 'right' : 'left']: position,
  };
};
