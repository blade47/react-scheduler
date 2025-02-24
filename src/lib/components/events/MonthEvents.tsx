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
import { isDateToday } from '@/lib/helpers/generals.tsx';

interface Props {
  date: Date;
  events: ProcessedEvent[];
  isOutsideMonth: boolean;
  maxVisibleEvents?: number;
  onEventClick?: (event: ProcessedEvent) => void;
  onMoreClick?: (date: Date) => void;
}

export const MonthEvents = memo(
  ({ date, events, isOutsideMonth, maxVisibleEvents = 3, onMoreClick }: Props) => {
    const dateDayjs = dayjs(date);
    const isToday = isDateToday(date);

    const { visibleEvents, hasMore, remainingCount } = useMemo(() => {
      const sortedEvents = [...events].sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        const aDuration = dayjs(a.end).diff(a.start);
        const bDuration = dayjs(b.end).diff(b.start);
        return bDuration - aDuration;
      });

      return {
        visibleEvents: sortedEvents.slice(0, maxVisibleEvents),
        hasMore: sortedEvents.length > maxVisibleEvents,
        remainingCount: sortedEvents.length - maxVisibleEvents,
      };
    }, [events, maxVisibleEvents]);

    return (
      <MonthCell className={isOutsideMonth ? 'outside-month' : ''}>
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
              hasPrev={dayjs(event.start).isBefore(dayjs(date).startOf('day'))}
              hasNext={dayjs(event.end).isAfter(dayjs(date).endOf('day'))}
            />
          ))}
          {hasMore && (
            <MoreEventsButton onClick={() => onMoreClick?.(date)}>
              +{remainingCount} more
            </MoreEventsButton>
          )}
        </MonthEventsContainer>
      </MonthCell>
    );
  }
);
