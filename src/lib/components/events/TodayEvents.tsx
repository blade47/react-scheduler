import { Fragment } from 'react';
import { BORDER_HEIGHT } from '../../helpers/constants';
import { isTimeZonedToday, traversCrossingEvents } from '../../helpers/generals';
import { ProcessedEvent } from '@/lib';
import CurrentTimeBar from './CurrentTimeBar';
import EventItem from './EventItem';
import { dayjs } from '@/config/dayjs';

interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  endHour: number;
  step: number;
  minuteHeight: number;
  direction: 'rtl' | 'ltr';
  timeZone?: string;
}

const TodayEvents = ({
  todayEvents,
  today,
  startHour,
  endHour,
  step,
  minuteHeight,
  direction,
  timeZone,
}: TodayEventsProps) => {
  const crossingIds: Array<number | string> = [];
  const calendarStartInMins = startHour * 60;
  const maxHeight = (endHour * 60 - calendarStartInMins) * minuteHeight;

  return (
    <Fragment>
      {isTimeZonedToday({ dateLeft: today, timeZone }) && (
        <CurrentTimeBar
          startHour={startHour}
          step={step}
          minuteHeight={minuteHeight}
          timeZone={timeZone}
          zIndex={2 * todayEvents.length + 1}
        />
      )}

      {todayEvents.map((event, i) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);

        // Calculate event dimensions
        const eventHeight = eventEnd.diff(eventStart, 'minute') * minuteHeight;
        const height = Math.min(eventHeight, maxHeight) - BORDER_HEIGHT;

        const eventStartInMins = eventStart.hour() * 60 + eventStart.minute();
        const minutesFromTop = Math.max(eventStartInMins - calendarStartInMins, 0);

        // Calculate positioning
        const topSpace = minutesFromTop * minuteHeight;
        const slots = height / 60;
        const heightBorderFactor = slots * BORDER_HEIGHT;
        const slotsFromTop = minutesFromTop / step;
        const top = topSpace + slotsFromTop;

        // Handle crossing events
        const crossingEvents = traversCrossingEvents(todayEvents, event);
        const alreadyRendered = crossingEvents.filter((e) => crossingIds.includes(e.event_id));
        crossingIds.push(event.event_id);

        // Calculate width and position based on crossing events
        const width =
          alreadyRendered.length > 0
            ? `calc(100% - ${100 - 98 / (alreadyRendered.length + 1)}%)`
            : '98%';

        const position =
          alreadyRendered.length > 0
            ? `${(100 / (crossingEvents.length + 1)) * alreadyRendered.length}%`
            : '';

        return (
          <div
            key={`${event.event_id}/${event.recurrenceId || ''}`}
            className="rs__event__item"
            style={{
              height: height + heightBorderFactor,
              top,
              width,
              zIndex: todayEvents.length + i,
              [direction === 'rtl' ? 'right' : 'left']: position,
            }}
          >
            <EventItem event={event} />
          </div>
        );
      })}
    </Fragment>
  );
};

export default TodayEvents;
