// components/month/MonthTable.tsx
import { memo, useCallback, useMemo } from 'react';
import { Typography } from '@mui/material';
import { TableGrid } from '../../theme/css';
import useStore from '../../hooks/useStore';
import { MonthCellMemo } from './MonthCell';
import { dayjs } from '@/config/dayjs';
import useSyncScroll from '../../hooks/useSyncScroll';
import { DefaultResource } from '@/lib/types';
import { getResourcedEvents, sortEventsByTheEarliest } from '../../helpers/generals';

interface MonthTableProps {
  daysList: Date[];
  resource?: DefaultResource;
  eachWeekStart: Date[];
}

const MonthTable = ({ daysList, resource, eachWeekStart }: MonthTableProps) => {
  const {
    height,
    selectedDate,
    events,
    handleGotoDay,
    resourceFields,
    fields,
    stickyNavigation,
    onClickMore,
  } = useStore();

  const { headersRef, bodyRef } = useSyncScroll();
  const selectedDayjs = dayjs(selectedDate);
  const monthStart = selectedDayjs.startOf('month');
  const monthEnd = selectedDayjs.endOf('month');

  const CELL_HEIGHT = height / eachWeekStart.length;

  const resourcedEvents = useMemo(() => {
    let filteredEvents = sortEventsByTheEarliest(events);
    if (resource) {
      filteredEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }
    return filteredEvents;
  }, [events, resource, resourceFields, fields]);

  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateDayjs = dayjs(date);
      return resourcedEvents.filter((event) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);
        return dateDayjs.isBetween(eventStart, eventEnd, 'day', '[]');
      });
    },
    [resourcedEvents]
  );

  const renderWeek = useCallback(
    (weekStart: Date) => {
      const days = Array.from({ length: 7 }, (_, i) => dayjs(weekStart).add(i, 'day').toDate());

      return days.map((date) => {
        const dateDayjs = dayjs(date);
        const isOutsideMonth = !dateDayjs.isBetween(monthStart, monthEnd, 'month', '[]');
        const events = getEventsForDate(date);

        return (
          <MonthCellMemo
            key={dateDayjs.valueOf()}
            date={date}
            events={events}
            isOutsideMonth={isOutsideMonth}
            onEventClick={() => {
              // Handle event click
            }}
            onMoreClick={() => {
              if (typeof onClickMore === 'function') {
                onClickMore(date, handleGotoDay);
              } else {
                handleGotoDay(date);
              }
            }}
            cellHeight={CELL_HEIGHT}
          />
        );
      });
    },
    [CELL_HEIGHT, monthStart, monthEnd, getEventsForDate, onClickMore, handleGotoDay]
  );

  return (
    <>
      <TableGrid
        days={7}
        ref={headersRef}
        indent="0"
        sticky="1"
        stickyNavigation={stickyNavigation}
      >
        {daysList.map((date, i) => (
          <Typography
            key={i}
            className="rs__cell rs__header rs__header__center"
            align="center"
            variant="body2"
          >
            {dayjs(date).format('ddd')}
          </Typography>
        ))}
      </TableGrid>

      <TableGrid days={7} ref={bodyRef} indent="0">
        {eachWeekStart.map((weekStart) => (
          <div key={dayjs(weekStart).valueOf()} style={{ display: 'contents' }}>
            {renderWeek(weekStart)}
          </div>
        ))}
      </TableGrid>
    </>
  );
};

export default memo(MonthTable);
