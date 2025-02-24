import { memo } from 'react';
import { isTimeZonedToday, traversCrossingEvents } from '../../helpers/generals';
import { ProcessedEvent } from '@/lib/types.ts';
import CurrentTimeBar from '@/lib/components/events/CurrentTimeBar.tsx';
import {
  calculateEventDimensions,
  calculateEventPosition,
} from '@/lib/components/events/TodayEventsUtils.ts';
import { TodayEventsWrapper } from '@/lib/components/events/TodayEventsWrapper.tsx';

export interface Props {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  endHour: number;
  step: number;
  minuteHeight: number;
  direction: 'rtl' | 'ltr';
  timeZone?: string;
}

export const TodayEvents = memo(
  ({ todayEvents, today, startHour, endHour, step, minuteHeight, direction, timeZone }: Props) => {
    const crossingIds: Array<number | string> = [];
    const calendarStartInMins = startHour * 60;
    const maxHeight = (endHour * 60 - calendarStartInMins) * minuteHeight;

    const showCurrentTimeBar = isTimeZonedToday({ dateLeft: today, timeZone });

    return (
      <>
        {showCurrentTimeBar && (
          <CurrentTimeBar
            startHour={startHour}
            step={step}
            minuteHeight={minuteHeight}
            timeZone={timeZone}
            zIndex={2 * todayEvents.length + 1}
          />
        )}

        {todayEvents.map((event, index) => {
          const dimensions = calculateEventDimensions({
            event,
            startHour,
            minuteHeight,
            maxHeight,
            step,
          });

          const crossingEvents = traversCrossingEvents(todayEvents, event);
          const alreadyRendered = crossingEvents.filter((e) => crossingIds.includes(e.event_id));
          crossingIds.push(event.event_id);

          const position = calculateEventPosition({
            event,
            crossingEvents,
            alreadyRendered,
            direction,
          });

          return (
            <TodayEventsWrapper
              key={`${event.event_id}/${event.recurrenceId || ''}`}
              event={event}
              style={{
                ...dimensions,
                ...position,
                zIndex: todayEvents.length + index,
              }}
            />
          );
        })}
      </>
    );
  }
);

TodayEvents.displayName = 'TodayEvents';
