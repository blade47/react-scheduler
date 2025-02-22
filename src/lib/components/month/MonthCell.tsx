import { memo, useMemo } from 'react';
import { Typography } from '@mui/material';
import {
  MonthCell,
  MonthDateHeader,
  MonthEventsContainer,
  MoreEventsButton,
} from '../../theme/css';
import { ProcessedEvent } from '@/lib/types';
import { dayjs } from '@/config/dayjs';
import EventItem from '../events/EventItem';
import { isDateToday } from '../../helpers/generals';

interface MonthCellProps {
  date: Date;
  events: ProcessedEvent[];
  isOutsideMonth: boolean;
  maxVisibleEvents?: number;
  onEventClick?: (event: ProcessedEvent) => void;
  onMoreClick?: (date: Date) => void;
  cellHeight: number;
}

const DEFAULT_VISIBLE_EVENTS = 3;

export const MonthCellComponent = ({
  date,
  events,
  isOutsideMonth,
  maxVisibleEvents = DEFAULT_VISIBLE_EVENTS,
  onMoreClick,
  cellHeight,
}: MonthCellProps) => {
  const dateDayjs = dayjs(date);
  const isToday = isDateToday(date);

  const { visibleEvents, hasMore, remainingCount } = useMemo(() => {
    const sortedEvents = [...events].sort((a, b) => {
      // Sort all-day events first, then by duration (longer first), then by start time
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;

      const aDuration = dayjs(a.end).diff(a.start);
      const bDuration = dayjs(b.end).diff(b.start);
      if (aDuration !== bDuration) return bDuration - aDuration;

      return dayjs(a.start).diff(b.start);
    });

    return {
      visibleEvents: sortedEvents.slice(0, maxVisibleEvents),
      hasMore: sortedEvents.length > maxVisibleEvents,
      remainingCount: sortedEvents.length - maxVisibleEvents,
    };
  }, [events, maxVisibleEvents]);

  return (
    <MonthCell
      className={`${isOutsideMonth ? 'outside-month' : ''} ${isToday ? 'today' : ''}`}
      style={{ height: cellHeight }}
    >
      <MonthDateHeader>
        <Typography
          variant="body2"
          color={isOutsideMonth ? 'text.disabled' : 'text.primary'}
          sx={{ fontWeight: isToday ? 600 : 400 }}
        >
          {dateDayjs.format('D')}
        </Typography>
      </MonthDateHeader>

      <MonthEventsContainer>
        {visibleEvents.map((event) => (
          <EventItem
            key={event.event_id}
            event={event}
            multiday={event.allDay || dayjs(event.end).diff(event.start, 'day') > 0}
            hasPrev={dayjs(event.start).isBefore(dateDayjs.startOf('day'))}
            hasNext={dayjs(event.end).isAfter(dateDayjs.endOf('day'))}
          />
        ))}

        {hasMore && (
          <MoreEventsButton
            onClick={() => onMoreClick?.(date)}
            title={`${remainingCount} more events`}
          >
            +{remainingCount} more
          </MoreEventsButton>
        )}
      </MonthEventsContainer>
    </MonthCell>
  );
};

export const MonthCellMemo = memo(MonthCellComponent);
