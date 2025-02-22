import { useMemo } from 'react';
import { AgendaDiv } from '../theme/css.ts';
import { ProcessedEvent } from '@/lib';
import useStore from '../hooks/useStore';
import { Typography } from '@mui/material';
import { filterTodayAgendaEvents, isDateToday, isTimeZonedToday } from '../helpers/generals';
import AgendaEventsList from '../components/events/AgendaEventsList';
import EmptyAgenda from '../components/events/EmptyAgenda';
import { dayjs } from '@/config/dayjs';
import type { Dayjs } from 'dayjs';

type Props = {
  events: ProcessedEvent[];
};

const MonthAgenda = ({ events }: Props) => {
  const { month, handleGotoDay, timeZone, selectedDate, translations, alwaysShowAgendaDays } =
    useStore();

  const { disableGoToDay, headRenderer } = month!;
  const selectedDayjs = dayjs(selectedDate);
  const daysInMonth = selectedDayjs.daysInMonth();

  const monthDates = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => selectedDayjs.date(i + 1).clone());
  }, [selectedDayjs, daysInMonth]);

  // Filter events for the selected month
  const monthEvents = useMemo(() => {
    return events.filter((event) => dayjs(event.start).isSame(selectedDayjs, 'month'));
  }, [events, selectedDayjs]);

  if (!alwaysShowAgendaDays && !monthEvents.length) {
    return <EmptyAgenda />;
  }

  return (
    <AgendaDiv>
      {monthDates.map((dayjs: Dayjs) => {
        const day = dayjs.toDate();

        // Check if it's today considering timezone
        const today = isTimeZonedToday({
          dateLeft: day,
          timeZone,
        });

        const dayEvents = filterTodayAgendaEvents(monthEvents, day);

        if (!alwaysShowAgendaDays && !dayEvents.length) return null;

        return (
          <div
            key={dayjs.valueOf()}
            className={`rs__agenda_row ${isDateToday(day) ? 'rs__today_cell' : ''}`}
          >
            <div className="rs__cell rs__agenda__cell">
              {typeof headRenderer === 'function' ? (
                <div>{headRenderer(day)}</div>
              ) : (
                <Typography
                  sx={{ fontWeight: today ? 'bold' : 'inherit' }}
                  color={today ? 'primary' : 'inherit'}
                  variant="body2"
                  className={!disableGoToDay ? 'rs__hover__op' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disableGoToDay) {
                      handleGotoDay(day);
                    }
                  }}
                >
                  {dayjs.format('DD ddd')}
                </Typography>
              )}
            </div>
            <div className="rs__cell rs__agenda_items">
              {dayEvents.length > 0 ? (
                <AgendaEventsList day={day} events={dayEvents} />
              ) : (
                <Typography sx={{ padding: 1 }}>{translations.noDataToDisplay}</Typography>
              )}
            </div>
          </div>
        );
      })}
    </AgendaDiv>
  );
};

export { MonthAgenda };
