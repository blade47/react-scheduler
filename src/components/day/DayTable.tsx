import { Fragment } from 'react';
import useStore from '../../hooks/useStore.ts';
import { TableGrid } from '@/theme/css.ts';
import {
  filterMultiDaySlot,
  filterTodayEvents,
  getHourFormat,
  getResourcedEvents,
  isDateToday,
} from '../../helpers/generals.tsx';
import { MULTI_DAY_EVENT_HEADER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from '@/helpers/constants.ts';
import { DefaultResource, ProcessedEvent } from '@/index.tsx';
import useSyncScroll from '../../hooks/useSyncScroll.ts';
import usePosition from '../../positionManger/usePosition.ts';
import EventItem from '../events/EventItem.tsx';
import { Typography } from '@mui/material';
import Cell from '../common/Cell.tsx';
import { dayjs } from '@/config/dayjs.ts';
import { TodayEvents } from '@/components/events/TodayEvents.tsx';
import { ResourceHeader } from '@/components/common/ResourceHeader.tsx';

type Props = {
  resources: DefaultResource[];
  hours: Date[];
  cellHeight: number;
  minutesHeight: number;
  resourcedEvents: ProcessedEvent[];
  selectedDate: Date;
  headerHeight: number;
};

const DayTable = ({
  resources,
  hours,
  cellHeight,
  minutesHeight,
  resourcedEvents,
  selectedDate,
  headerHeight,
}: Props) => {
  const { day, resourceFields, direction, hourFormat, timeZone, stickyNavigation, fields } =
    useStore();
  const { startHour, endHour, step, cellRenderer, hourRenderer } = day!;

  const { renderedSlots } = usePosition();
  const { headersRef, bodyRef } = useSyncScroll();

  const hFormat = getHourFormat(hourFormat);

  const renderMultiDayEvents = (events: ProcessedEvent[], resource: DefaultResource) => {
    const resourceId = resource[resourceFields.idField];
    const resourceEvents = getResourcedEvents(events, resource, resourceFields, fields);
    const allMulti = filterMultiDaySlot(resourceEvents, selectedDate, timeZone);

    return allMulti.map((event) => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      const hasPrev = eventStart.startOf('day').isBefore(dayjs(selectedDate).startOf('day'));
      const hasNext = eventEnd.endOf('day').isAfter(dayjs(selectedDate).endOf('day'));

      const day = dayjs(selectedDate).format('YYYY-MM-DD');
      const rendered = renderedSlots?.[resourceId]?.[day];
      const position = rendered?.[event.event_id] || 0;

      return (
        <div
          key={event.event_id}
          className="rs__multi_day"
          style={{
            top: position * MULTI_DAY_EVENT_HEIGHT + MULTI_DAY_EVENT_HEADER_HEIGHT,
            width: '99.9%',
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
      <TableGrid
        days={resources.length}
        ref={headersRef}
        sticky="1"
        stickyNavigation={stickyNavigation}
      >
        <span className="rs__cell rs__time"></span>
        {resources.map((resource) => (
          <span
            key={resource[resourceFields.idField]}
            className="rs__cell rs__header"
            style={{ height: headerHeight }}
          >
            <ResourceHeader resource={resource} />
            {renderMultiDayEvents(resourcedEvents, resource)}
          </span>
        ))}
      </TableGrid>

      <TableGrid days={resources.length} ref={bodyRef}>
        {hours.map((h, i) => (
          <Fragment key={dayjs(h).valueOf()}>
            <span style={{ height: cellHeight }} className="rs__cell rs__header rs__time">
              {typeof hourRenderer === 'function' ? (
                <div>{hourRenderer(dayjs(h).format(hFormat))}</div>
              ) : (
                <Typography variant="caption">{dayjs(h).format(hFormat)}</Typography>
              )}
            </span>
            {resources.map((resource) => {
              const start = dayjs(
                `${dayjs(selectedDate).format('YYYY/MM/DD')} ${dayjs(h).format(hFormat)}`
              );
              const end = start.add(step, 'minute');
              const field = resourceFields.idField;

              // Get events for this specific resource
              const resourceEvents = getResourcedEvents(
                resourcedEvents,
                resource,
                resourceFields,
                fields
              );

              return (
                <span
                  key={resource[resourceFields.idField]}
                  className={`rs__cell ${isDateToday(selectedDate) ? 'rs__today_cell' : ''}`}
                >
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={filterTodayEvents(resourceEvents, selectedDate, timeZone)}
                      today={selectedDate}
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
                    day={selectedDate}
                    height={cellHeight}
                    resourceKey={field}
                    resourceVal={resource[field]}
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

export default DayTable;
