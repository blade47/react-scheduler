import { Fragment, useMemo } from 'react';
import { ProcessedEvent } from '@/lib';
import { Typography } from '@mui/material';
import EventItem from './EventItem';
import {
  MONTH_BAR_HEIGHT,
  MONTH_NUMBER_HEIGHT,
  MULTI_DAY_EVENT_HEIGHT,
} from '../../helpers/constants';
import { convertEventTimeZone, differenceInDaysOmitTime } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import usePosition from '../../positionManger/usePosition';
import { dayjs } from '@/config/dayjs';

interface MonthEventProps {
  events: ProcessedEvent[];
  resourceId?: string;
  today: Date;
  eachWeekStart: Date[];
  eachFirstDayInCalcRow: Date | null;
  daysList: Date[];
  onViewMore(day: Date): void;
  cellHeight: number;
}

const MonthEvents = ({
  events,
  resourceId,
  today,
  eachWeekStart,
  eachFirstDayInCalcRow,
  daysList,
  onViewMore,
  cellHeight,
}: MonthEventProps) => {
  const LIMIT = Math.round((cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1);
  const { translations, month, timeZone } = useStore();
  const { renderedSlots } = usePosition();
  const todayStr = dayjs(today).format('YYYY-MM-DD');

  const renderEvents = useMemo(() => {
    const elements: JSX.Element[] = [];
    const weekStartOn = month?.weekStartOn || 0;

    for (let i = 0; i < Math.min(events.length, LIMIT + 1); i++) {
      const event = convertEventTimeZone(events[i], timeZone);
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      const firstDayDayjs = eachFirstDayInCalcRow ? dayjs(eachFirstDayInCalcRow) : null;

      const fromPrevWeek = !!firstDayDayjs && eventStart.isBefore(firstDayDayjs);
      const start = fromPrevWeek && firstDayDayjs ? firstDayDayjs.toDate() : event.start;
      let eventLength = differenceInDaysOmitTime(start, event.end) + 1;

      const toNextWeek = eventEnd.diff(dayjs(start), 'week', true) > 0;

      if (toNextWeek) {
        const notAccurateWeekStart = eventStart.startOf('week').day(weekStartOn);

        // Find closest week start
        const closestStart = eachWeekStart.reduce(
          (closest, date) => {
            if (!closest) return date;

            const currentDiff = Math.abs(dayjs(date).diff(notAccurateWeekStart));
            const closestDiff = Math.abs(dayjs(closest).diff(notAccurateWeekStart));

            return currentDiff < closestDiff ? date : closest;
          },
          null as Date | null
        );

        if (closestStart) {
          const startDiff = !eachFirstDayInCalcRow
            ? eventStart.diff(dayjs(closestStart), 'day')
            : 0;

          eventLength = daysList.length - startDiff;
        }
      }

      const rendered = renderedSlots?.[resourceId || 'all']?.[todayStr];
      const position = rendered?.[event.event_id] || 0;
      const topSpace = Math.min(position, LIMIT) * MULTI_DAY_EVENT_HEIGHT + MONTH_NUMBER_HEIGHT;

      if (position >= LIMIT) {
        elements.push(
          <Typography
            key={i}
            width="100%"
            className="rs__multi_day rs__hover__op"
            style={{ top: topSpace, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.start);
            }}
          >
            {`${Math.abs(events.length - i)} ${translations.moreEvents}`}
          </Typography>
        );
        break;
      }

      const isMultiDay = differenceInDaysOmitTime(event.start, event.end) > 0;

      elements.push(
        <div
          key={`${event.event_id}_${i}`}
          className="rs__multi_day"
          style={{
            top: topSpace,
            width: `${100 * eventLength}%`,
            height: MONTH_BAR_HEIGHT,
          }}
        >
          <EventItem
            event={event}
            showdate={false}
            multiday={isMultiDay}
            hasPrev={fromPrevWeek}
            hasNext={toNextWeek}
          />
        </div>
      );
    }

    return elements;
  }, [
    month?.weekStartOn,
    events,
    LIMIT,
    timeZone,
    eachFirstDayInCalcRow,
    renderedSlots,
    resourceId,
    todayStr,
    eachWeekStart,
    daysList.length,
    translations.moreEvents,
    onViewMore,
  ]);

  return <Fragment>{renderEvents}</Fragment>;
};

export default MonthEvents;
