import React, { memo, Fragment } from 'react';
import { Typography } from '@mui/material';
import TodayTypo from '../../../components/common/TodayTypo.tsx';
import EventItem from '../../../components/events/EventItem.tsx';
import { CellRenderedProps, DefaultResource, ProcessedEvent } from '@/index.tsx';
import {
  calcCellHeight,
  calcMinuteHeight,
  filterMultiDaySlot,
  filterTodayEvents,
  getHourFormat,
  isDateToday,
} from '../../../helpers/generals.tsx';
import Cell from '../../../components/common/Cell.tsx';
import { MULTI_DAY_EVENT_HEIGHT } from '../../../helpers/constants.ts';
import useStore from '../../../hooks/useStore.ts';
import { dayjs } from '@/config/dayjs.ts';
import { TodayEvents } from '@/components/events/TodayEvents.tsx';
import { TableGrid } from '@/theme/css.ts';

interface Props {
  resource?: DefaultResource;
  hours: Date[];
  selectedDate: Date;
  events: ProcessedEvent[];
  headerHeight: number;
  cellRenderer?: (props: CellRenderedProps) => React.ReactNode;
  headRenderer?: (day: Date) => React.ReactNode;
  hourRenderer?: (hour: string) => React.ReactNode;
}

export const DayGrid = memo(
  ({
    resource,
    hours,
    selectedDate,
    events,
    headerHeight,
    cellRenderer,
    headRenderer,
    hourRenderer,
  }: Props) => {
    const { height, day, direction, hourFormat, timeZone, resourceFields, stickyNavigation } =
      useStore();

    const { startHour, endHour, step } = day!;
    const selectedDayjs = dayjs(selectedDate);
    const hFormat = getHourFormat(hourFormat);
    const CELL_HEIGHT = calcCellHeight(height, hours.length);
    const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);

    const renderMultiDayEvents = (events: ProcessedEvent[]) => {
      const todayMulti = filterMultiDaySlot(events, selectedDate, timeZone);

      return (
        <div
          className="rs__block_col"
          style={{ height: MULTI_DAY_EVENT_HEIGHT * todayMulti.length }}
        >
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

    return (
      <>
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
            {renderMultiDayEvents(events)}
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
                <span className="rs__cell rs__header rs__time" style={{ height: CELL_HEIGHT }}>
                  {typeof hourRenderer === 'function' ? (
                    <div>{hourRenderer(hourDayjs.format(hFormat))}</div>
                  ) : (
                    <Typography variant="caption">{hourDayjs.format(hFormat)}</Typography>
                  )}
                </span>
                <span className={`rs__cell ${isDateToday(selectedDate) ? 'rs__today_cell' : ''}`}>
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={filterTodayEvents(events, selectedDate, timeZone)}
                      today={start.toDate()}
                      minuteHeight={MINUTE_HEIGHT}
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
  }
);

DayGrid.displayName = 'DayGrid';
