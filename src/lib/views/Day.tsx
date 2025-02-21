import { useEffect, useCallback, Fragment } from 'react';
import { Typography } from '@mui/material';
import TodayTypo from '../components/common/TodayTypo';
import EventItem from '../components/events/EventItem';
import { CellRenderedProps, DayHours, DefaultResource, ProcessedEvent } from '@/lib';
import {
  calcCellHeight,
  calcMinuteHeight,
  filterMultiDaySlot,
  filterTodayEvents,
  getHourFormat,
  getResourcedEvents,
  isDateToday,
} from '../helpers/generals';
import { WithResources } from '../components/common/WithResources';
import Cell from '../components/common/Cell';
import TodayEvents from '../components/events/TodayEvents';
import { TableGrid } from '../styles/styles';
import { MULTI_DAY_EVENT_HEIGHT } from '../helpers/constants';
import useStore from '../hooks/useStore';
import { DayAgenda } from './DayAgenda';
import { dayjs } from '@/config/dayjs';
import type { Dayjs } from 'dayjs';

export interface DayProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
}

const Day = () => {
  const {
    day,
    selectedDate,
    events,
    height,
    getRemoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    resourceViewMode,
    fields,
    direction,
    hourFormat,
    timeZone,
    stickyNavigation,
    agenda,
  } = useStore();

  const { startHour, endHour, step, cellRenderer, headRenderer, hourRenderer } = day!;

  const selectedDayjs = dayjs(selectedDate);

  const START_TIME = selectedDayjs.hour(startHour).minute(0).second(0);

  const END_TIME = selectedDayjs.hour(endHour).minute(-step).second(0);

  const generateHoursArray = (start: Dayjs, end: Dayjs, stepMinutes: number): Date[] => {
    const result: Date[] = [];
    let current = start.clone();

    while (current.isBefore(end) || current.isSame(end)) {
      result.push(current.toDate());
      current = current.add(stepMinutes, 'minute');
    }
    return result;
  };

  const hours = generateHoursArray(START_TIME, END_TIME, step);
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const hFormat = getHourFormat(hourFormat);

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);

      const fetchStart = START_TIME.subtract(1, 'day');
      const fetchEnd = END_TIME.add(1, 'day');

      const events = await getRemoteEvents!({
        start: fetchStart.toDate(),
        end: fetchEnd.toDate(),
        view: 'day',
      });

      if (Array.isArray(events) && events.length > 0) {
        handleState(events, 'events');
      }
    } finally {
      triggerLoading(false);
    }
  }, [triggerLoading, START_TIME, END_TIME, getRemoteEvents, handleState]);

  useEffect(() => {
    if (typeof getRemoteEvents === 'function') {
      fetchEvents();
    }
  }, [fetchEvents, getRemoteEvents]);

  const renderMultiDayEvents = (events: ProcessedEvent[]) => {
    const todayMulti = filterMultiDaySlot(events, selectedDate, timeZone);

    return (
      <div className="rs__block_col" style={{ height: MULTI_DAY_EVENT_HEIGHT * todayMulti.length }}>
        {todayMulti.map((event, i) => {
          const eventStartDayjs = dayjs(event.start).tz(timeZone);
          const eventEndDayjs = dayjs(event.end).tz(timeZone);
          const todayStartDayjs = selectedDayjs.tz(timeZone).startOf('day');
          const todayEndDayjs = selectedDayjs.tz(timeZone).endOf('day');

          const hasPrev = eventStartDayjs.isBefore(todayStartDayjs);
          const hasNext = eventEndDayjs.isAfter(todayEndDayjs);

          return (
            <div
              key={event.event_id}
              className="rs__multi_day"
              style={{
                top: i * MULTI_DAY_EVENT_HEIGHT,
                width: '99.9%',
                overflowX: 'hidden',
              }}
            >
              <EventItem event={event} multiday hasPrev={hasPrev} hasNext={hasNext} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (resource?: DefaultResource) => {
    let resourcedEvents = events;
    if (resource) {
      resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
    }

    if (agenda) {
      return <DayAgenda events={resourcedEvents} />;
    }

    // Equalizing multi-day section height
    const shouldEqualize = resources.length && resourceViewMode === 'default';
    const allWeekMulti = filterMultiDaySlot(
      shouldEqualize ? events : resourcedEvents,
      selectedDate,
      timeZone
    );
    const headerHeight = MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + 45;

    return (
      <>
        {/* Header */}
        <TableGrid days={1} sticky="1" stickyNavigation={stickyNavigation}>
          <span className="rs__cell"></span>
          <span
            className={`rs__cell rs__header ${isDateToday(selectedDate) ? 'rs__today_cell' : ''}`}
            style={{ height: headerHeight }}
          >
            {typeof headRenderer === 'function' ? (
              <div>{headRenderer(selectedDate)}</div>
            ) : (
              <TodayTypo date={selectedDate} />
            )}
            {renderMultiDayEvents(resourcedEvents)}
          </span>
        </TableGrid>

        <TableGrid days={1}>
          {hours.map((hour, i) => {
            const hourDayjs = dayjs(hour);
            const start = dayjs(
              `${selectedDayjs.format('YYYY/MM/DD')} ${hourDayjs.format(hFormat)}`
            );
            const end = start.add(step, 'minute');

            const field = resourceFields.idField;

            return (
              <Fragment key={hourDayjs.valueOf()}>
                {/* Time Cells */}
                <span className="rs__cell rs__header rs__time" style={{ height: CELL_HEIGHT }}>
                  {typeof hourRenderer === 'function' ? (
                    <div>{hourRenderer(hourDayjs.format(hFormat))}</div>
                  ) : (
                    <Typography variant="caption">{hourDayjs.format(hFormat)}</Typography>
                  )}
                </span>
                <span className={`rs__cell ${isDateToday(selectedDate) ? 'rs__today_cell' : ''}`}>
                  {/* Events of this day - run once on the top hour column */}
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={filterTodayEvents(resourcedEvents, selectedDate, timeZone)}
                      today={START_TIME.toDate()}
                      minuteHeight={MINUTE_HEIGHT}
                      startHour={startHour}
                      endHour={endHour}
                      step={step}
                      direction={direction}
                      timeZone={timeZone}
                    />
                  )}
                  {/* Cell */}
                  <Cell
                    start={start.toDate()}
                    end={end.toDate()}
                    day={selectedDate}
                    height={CELL_HEIGHT}
                    resourceKey={field}
                    resourceVal={resource ? resource[field] : null}
                    cellRenderer={cellRenderer}
                  />
                </span>
              </Fragment>
            );
          })}
        </TableGrid>
      </>
    );
  };

  return resources.length ? <WithResources renderChildren={renderTable} /> : renderTable();
};

export { Day };
