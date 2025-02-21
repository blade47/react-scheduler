import { Fragment, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { TableGrid } from '../../styles/styles';
import {
  differenceInDaysOmitTime,
  filterMultiDaySlot,
  filterTodayEvents,
  getHourFormat,
  isDateToday,
} from '../../helpers/generals';
import { MULTI_DAY_EVENT_HEIGHT } from '../../helpers/constants';
import { DefaultResource, ProcessedEvent } from '@/lib';
import useSyncScroll from '../../hooks/useSyncScroll';
import TodayTypo from '../common/TodayTypo';
import usePosition from '../../positionManger/usePosition';
import EventItem from '../events/EventItem';
import { Typography } from '@mui/material';
import TodayEvents from '../events/TodayEvents';
import Cell from '../common/Cell';
import { dayjs } from '@/config/dayjs';

type Props = {
  daysList: Date[];
  hours: Date[];
  cellHeight: number;
  minutesHeight: number;
  resource?: DefaultResource;
  resourcedEvents: ProcessedEvent[];
};

const WeekTable = ({
  daysList,
  hours,
  cellHeight,
  minutesHeight,
  resourcedEvents,
  resource,
}: Props) => {
  const {
    week,
    events,
    handleGotoDay,
    resources,
    resourceFields,
    resourceViewMode,
    direction,
    hourFormat,
    timeZone,
    stickyNavigation,
  } = useStore();

  const { startHour, endHour, step, cellRenderer, disableGoToDay, headRenderer, hourRenderer } =
    week!;

  const { renderedSlots } = usePosition();
  const { headersRef, bodyRef } = useSyncScroll();
  const MULTI_SPACE = MULTI_DAY_EVENT_HEIGHT;

  const weekStart = dayjs(daysList[0]).startOf('day');
  const weekEnd = dayjs(daysList[daysList.length - 1]).endOf('day');
  const hFormat = getHourFormat(hourFormat);

  const headerHeight = useMemo(() => {
    const shouldEqualize = resources.length && resourceViewMode === 'default';
    const allWeekMulti = filterMultiDaySlot(
      shouldEqualize ? events : resourcedEvents,
      daysList,
      timeZone,
      true
    );
    return MULTI_SPACE * allWeekMulti.length + 45;
  }, [
    MULTI_SPACE,
    daysList,
    events,
    resourceViewMode,
    resourcedEvents,
    resources.length,
    timeZone,
  ]);

  const renderMultiDayEvents = (
    events: ProcessedEvent[],
    today: Date,
    resource?: DefaultResource
  ) => {
    const isFirstDayInWeek = dayjs(today).isSame(weekStart, 'day');
    const allWeekMulti = filterMultiDaySlot(events, daysList, timeZone);

    const multiDays = allWeekMulti
      .filter((e) => {
        const eventStart = dayjs(e.start);
        return eventStart.isBefore(weekStart)
          ? isFirstDayInWeek
          : eventStart.isSame(dayjs(today), 'day');
      })
      .sort((a, b) => dayjs(b.end).valueOf() - dayjs(a.end).valueOf());

    return multiDays.map((event) => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      const hasPrev = eventStart.startOf('day').isBefore(weekStart);
      const hasNext = eventEnd.endOf('day').isAfter(weekEnd);
      const eventLength =
        differenceInDaysOmitTime(
          hasPrev ? weekStart.toDate() : event.start,
          hasNext ? weekEnd.toDate() : event.end
        ) + 1;

      const day = dayjs(today).format('YYYY-MM-DD');
      const resourceId = resource ? resource[resourceFields.idField] : 'all';
      const rendered = renderedSlots?.[resourceId]?.[day];
      const position = rendered?.[event.event_id] || 0;

      return (
        <div
          key={event.event_id}
          className="rs__multi_day"
          style={{
            top: position * MULTI_SPACE + 45,
            width: `${99.9 * eventLength}%`,
            overflowX: 'hidden',
          }}
        >
          <EventItem event={event} hasPrev={hasPrev} hasNext={hasNext} multiday />
        </div>
      );
    });
  };

  return (
    <>
      {/* Header days */}
      <TableGrid
        days={daysList.length}
        ref={headersRef}
        sticky="1"
        stickyNavigation={stickyNavigation}
      >
        <span className="rs__cell rs__time"></span>
        {daysList.map((date, i) => (
          <span
            key={i}
            className={`rs__cell rs__header ${isDateToday(date) ? 'rs__today_cell' : ''}`}
            style={{ height: headerHeight }}
          >
            {typeof headRenderer === 'function' ? (
              <div>{headRenderer(date)}</div>
            ) : (
              <TodayTypo
                date={date}
                onClick={!disableGoToDay ? () => handleGotoDay(date) : undefined}
              />
            )}
            {renderMultiDayEvents(resourcedEvents, date, resource)}
          </span>
        ))}
      </TableGrid>

      <TableGrid days={daysList.length} ref={bodyRef}>
        {hours.map((h, i) => (
          <Fragment key={dayjs(h).valueOf()}>
            <span style={{ height: cellHeight }} className="rs__cell rs__header rs__time">
              {typeof hourRenderer === 'function' ? (
                <div>{hourRenderer(dayjs(h).format(hFormat))}</div>
              ) : (
                <Typography variant="caption">{dayjs(h).format(hFormat)}</Typography>
              )}
            </span>
            {daysList.map((date, ii) => {
              const start = dayjs(
                `${dayjs(date).format('YYYY/MM/DD')} ${dayjs(h).format(hFormat)}`
              );
              const end = start.add(step, 'minute');
              const field = resourceFields.idField;

              return (
                <span key={ii} className={`rs__cell ${isDateToday(date) ? 'rs__today_cell' : ''}`}>
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={filterTodayEvents(resourcedEvents, date, timeZone)}
                      today={date}
                      minuteHeight={minutesHeight}
                      startHour={startHour}
                      endHour={endHour}
                      step={step}
                      direction={direction}
                      timeZone={timeZone}
                    />
                  )}
                  <Cell
                    start={start.toDate()}
                    end={end.toDate()}
                    day={date}
                    height={cellHeight}
                    resourceKey={field}
                    resourceVal={resource ? resource[field] : null}
                    cellRenderer={cellRenderer}
                  />
                </span>
              );
            })}
          </Fragment>
        ))}
      </TableGrid>
    </>
  );
};

export default WeekTable;
