import { dayjs } from '@/config/dayjs.ts';
import {
  DefaultResource,
  FieldProps,
  ProcessedEvent,
  ResourceFields,
  SchedulerProps,
} from '@/index.tsx';
import { View, WeekDays } from '@/types.ts';

export const getAvailableViews = (state: SchedulerProps): View[] => {
  const views: View[] = [];
  if (state.month) {
    views.push('month');
  }
  if (state.week) {
    views.push('week');
  }
  if (state.day) {
    views.push('day');
  }
  return views;
};

export const arraytizeFieldVal = (field: FieldProps, val: any, event?: Partial<ProcessedEvent>) => {
  const arrytize = field.config?.multiple && !Array.isArray(event?.[field.name] || field.default);
  const value = arrytize ? (val ? [val] : []) : val;
  const validity = arrytize ? value.length : value;
  return { value, validity };
};

export const getResourcedEvents = (
  events: ProcessedEvent[],
  resource: DefaultResource,
  resourceFields: ResourceFields,
  fields: FieldProps[]
): ProcessedEvent[] => {
  const keyName = resourceFields.idField;
  const resourceField = fields.find((f) => f.name === keyName);
  const isMultiple = !!resourceField?.config?.multiple;

  return events.filter((event) => {
    const arrytize = isMultiple && !Array.isArray(event[keyName]);
    const eventVal = arrytize ? [event[keyName]] : event[keyName];

    const isThisResource =
      isMultiple || Array.isArray(eventVal)
        ? eventVal.includes(resource[keyName])
        : eventVal === resource[keyName];

    if (isThisResource) {
      return {
        ...event,
        color: event.color || resource[resourceFields.colorField || ''],
      };
    }
    return false;
  });
};

export const traversCrossingEvents = (
  todayEvents: ProcessedEvent[],
  event: ProcessedEvent
): ProcessedEvent[] => {
  const eventStart = dayjs(event.start);
  const eventEnd = dayjs(event.end);

  return todayEvents.filter((e) => {
    if (e.event_id === event.event_id) return false;

    const eStart = dayjs(e.start);
    const eEnd = dayjs(e.end);

    return (
      eventStart.add(1, 'minute').isBetween(eStart, eEnd, null, '[]') ||
      eventEnd.subtract(1, 'minute').isBetween(eStart, eEnd, null, '[]') ||
      eStart.add(1, 'minute').isBetween(eventStart, eventEnd, null, '[]') ||
      eEnd.subtract(1, 'minute').isBetween(eventStart, eventEnd, null, '[]')
    );
  });
};

export const calcMinuteHeight = (cellHeight: number, step: number): number => {
  return Math.ceil(cellHeight) / step;
};

export const calcCellHeight = (tableHeight: number, hoursLength: number): number => {
  return Math.max(tableHeight / hoursLength, 60);
};

export const differenceInDaysOmitTime = (start: Date, end: Date): number => {
  const startDay = dayjs(start).startOf('day');
  const endDay = dayjs(end).endOf('day').subtract(1, 'second');
  return endDay.diff(startDay, 'day');
};

export const convertRRuleDateToDate = (rruleDate: Date): Date => {
  return dayjs.utc(rruleDate.getTime()).toDate();
};

export const getRecurrencesForDate = (
  event: ProcessedEvent,
  today: Date,
  timeZone?: string
): ProcessedEvent[] => {
  if (!event.recurring) {
    return [convertEventTimeZone(event, timeZone)];
  }

  const duration = dayjs(event.end).diff(event.start);

  return event.recurring
    .between(today, dayjs(today).add(1, 'day').toDate(), true)
    .map((d: Date, index: number) => {
      const start = convertRRuleDateToDate(d);
      return {
        ...event,
        recurrenceId: index,
        start,
        end: dayjs(start).add(duration, 'millisecond').toDate(),
      };
    })
    .map((event) => convertEventTimeZone(event, timeZone));
};

export const filterTodayEvents = (
  events: ProcessedEvent[],
  today: Date,
  timeZone?: string
): ProcessedEvent[] => {
  const todayDayjs = dayjs(today);
  const list: ProcessedEvent[] = [];

  for (const event of events) {
    const recurrences = getRecurrencesForDate(event, today, timeZone);

    for (const rec of recurrences) {
      const isToday =
        !rec.allDay &&
        todayDayjs.isSame(dayjs(rec.start), 'day') &&
        !differenceInDaysOmitTime(rec.start, rec.end);

      if (isToday) {
        list.push(rec);
      }
    }
  }

  return sortEventsByTheLengthest(list);
};

export const filterTodayAgendaEvents = (
  events: ProcessedEvent[],
  today: Date
): ProcessedEvent[] => {
  const todayDayjs = dayjs(today);

  const list = events.filter((ev) => {
    const startDay = dayjs(ev.start).startOf('day');
    const endDay = dayjs(ev.end).subtract(1, 'minute').endOf('day');

    return todayDayjs.isBetween(startDay, endDay, 'day', '[]');
  });

  return sortEventsByTheEarliest(list);
};

export const sortEventsByTheLengthest = (events: ProcessedEvent[]): ProcessedEvent[] => {
  return [...events].sort((a, b) => {
    const aDuration = dayjs(a.end).diff(a.start);
    const bDuration = dayjs(b.end).diff(b.start);
    return bDuration - aDuration;
  });
};

export const sortEventsByTheEarliest = (events: ProcessedEvent[]): ProcessedEvent[] => {
  return [...events].sort((a, b) => {
    const isMulti = a.allDay || differenceInDaysOmitTime(a.start, a.end) > 0;
    return isMulti ? -1 : dayjs(a.start).diff(b.start);
  });
};

export const filterMultiDaySlot = (
  events: ProcessedEvent[],
  date: Date | Date[],
  timeZone?: string,
  lengthOnly?: boolean
): ProcessedEvent[] => {
  const isMultiDates = Array.isArray(date);
  const list: ProcessedEvent[] = [];
  const multiPerDay: Record<string, ProcessedEvent[]> = {};

  for (const event of events) {
    const convertedEvent = convertEventTimeZone(event, timeZone);
    const eventStart = dayjs(convertedEvent.start);
    const eventEnd = dayjs(convertedEvent.end);

    let withinSlot =
      convertedEvent.allDay ||
      differenceInDaysOmitTime(convertedEvent.start, convertedEvent.end) > 0;

    if (!withinSlot) continue;

    if (isMultiDates) {
      withinSlot = (date as Date[]).some((weekday) => {
        const weekdayDayjs = dayjs(weekday);
        return weekdayDayjs.isBetween(
          eventStart.startOf('day'),
          eventEnd.endOf('day'),
          'day',
          '[]'
        );
      });
    } else {
      const dateDayjs = dayjs(date as Date);
      withinSlot = dateDayjs.isBetween(
        eventStart.startOf('day'),
        eventEnd.endOf('day'),
        'day',
        '[]'
      );
    }

    if (withinSlot) {
      list.push(convertedEvent);

      if (isMultiDates) {
        for (const d of date as Date[]) {
          const start = dayjs(d).format('YYYY-MM-DD');
          if (dayjs(d).isBetween(eventStart.startOf('day'), eventEnd.endOf('day'), 'day', '[]')) {
            multiPerDay[start] = (multiPerDay[start] || []).concat(convertedEvent);
          }
        }
      } else {
        const start = eventStart.format('YYYY-MM-DD');
        multiPerDay[start] = (multiPerDay[start] || []).concat(convertedEvent);
      }
    }
  }

  if (isMultiDates && lengthOnly) {
    return Object.values(multiPerDay).sort((a, b) => b.length - a.length)[0] || [];
  }

  return list;
};

export const convertEventTimeZone = (event: ProcessedEvent, timeZone?: string): ProcessedEvent => {
  if (!timeZone || event.convertedTz) return event;

  return {
    ...event,
    start: getTimeZonedDate(event.start, timeZone),
    end: getTimeZonedDate(event.end, timeZone),
    convertedTz: true,
  };
};

export const getTimeZonedDate = (date: Date, timeZone?: string): Date => {
  if (!timeZone) return date;
  return dayjs(date).tz(timeZone).toDate();
};

export const revertTimeZonedDate = (date: Date, timeZone?: string): Date => {
  if (!timeZone) return date;
  return dayjs.tz(date, timeZone).local().toDate();
};

export const isTimeZonedToday = ({
  dateLeft,
  dateRight,
  timeZone,
}: {
  dateLeft: Date;
  dateRight?: Date;
  timeZone?: string;
}): boolean => {
  const rightDate = dateRight || new Date();
  return dayjs(dateLeft).isSame(getTimeZonedDate(rightDate, timeZone), 'day');
};

export const getHourFormat = (hourFormat: '12' | '24'): string => {
  return hourFormat === '12' ? 'hh:mm A' : 'HH:mm';
};

export const isDateToday = (date: Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isDateInRange = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null
): boolean => {
  const dayjsDate = dayjs(date).startOf('day');

  if (minDate && dayjsDate.isBefore(dayjs(minDate))) return false;
  return !(maxDate && dayjsDate.isAfter(dayjs(maxDate)));
};

export const getNewDate = (
  date: Date,
  direction: 'prev' | 'next',
  time: 'day' | 'week' | 'month' = 'day'
): Date =>
  direction === 'prev' ? dayjs(date).subtract(1, time).toDate() : dayjs(date).add(1, time).toDate();

export const generateWeekDays = (
  selectedDate: Date,
  weekStartOn: WeekDays,
  weekDays: WeekDays[],
  maxDate?: Date | null
): Date[] => {
  const weekStart = dayjs(selectedDate).startOf('week').add(weekStartOn, 'day');

  return generateDays(weekStart.toDate(), weekDays)
    .filter(
      (date) => !maxDate || dayjs(date).startOf('day').isSameOrBefore(dayjs(maxDate).startOf('day'))
    )
    .sort((a, b) => a.getTime() - b.getTime());
};

export const generateDays = (weekStart: Date, weekDays: WeekDays[]): Date[] => {
  return weekDays.map((d) => dayjs(weekStart).add(d, 'day').startOf('day').toDate());
};

export const generateHourSlots = (startHour: Date, endHour: Date, stepMinutes: number): Date[] => {
  const result: Date[] = [];
  let current = dayjs(startHour).clone();

  while (current.isBefore(endHour) || current.isSame(endHour)) {
    result.push(current.toDate());
    current = current.add(stepMinutes, 'minute');
  }
  return result;
};

export const generateMonthWeeks = (
  startMonth: Date,
  endMonth: Date,
  weekStartsOn: WeekDays
): Date[] => {
  const weeks: Date[] = [];
  const startMonthDayjs = dayjs(startMonth);
  const endMonthDayjs = dayjs(endMonth);
  let current = startMonthDayjs.startOf('week').add(weekStartsOn, 'day');
  while (current.isBefore(endMonthDayjs) || current.isSame(endMonthDayjs, 'day')) {
    weeks.push(current.toDate());
    current = current.add(1, 'week');
  }
  return weeks;
};

export const getWeekBoundaries = (
  selectedDate: Date,
  weekDays: WeekDays[],
  minDate?: Date | null,
  maxDate?: Date | null
): { weekStart: Date; weekStartOn: WeekDays } => {
  const selectedDayjs = dayjs(selectedDate);
  const minDayjs = minDate ? dayjs(minDate).startOf('day') : null;
  const maxDayjs = maxDate ? dayjs(maxDate).startOf('day') : null;

  // If selected date is out of range or we don't have enough space forward,
  // start from minDate
  if (
    !isDateInRange(selectedDate, minDate, maxDate) ||
    (maxDayjs &&
      dayjs(selectedDate)
        .add(weekDays.length - 1, 'day')
        .isAfter(maxDayjs))
  ) {
    return {
      weekStart: minDayjs?.toDate() ?? selectedDate,
      weekStartOn: (minDayjs?.day() as WeekDays) ?? weekDays[0],
    };
  }

  // If we have enough space for all weekDays, start from selected date
  return {
    weekStart: selectedDate,
    weekStartOn: selectedDayjs.day() as WeekDays,
  };
};
