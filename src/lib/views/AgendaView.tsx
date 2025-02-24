import { memo, useMemo } from 'react';
import { AgendaDay } from './AgendaDay';
import { dayjs } from '@/config/dayjs';
import { AgendaViewProps } from '@/lib/types.ts';
import useStore from '@/lib/hooks/useStore.ts';
import { filterTodayAgendaEvents, isTimeZonedToday } from '@/lib/helpers/generals.tsx';
import EmptyAgenda from '@/lib/components/events/EmptyAgenda.tsx';
import { AgendaContainer } from '@/lib/theme/css.ts';

export const AgendaView = memo(({ events, view, daysList }: AgendaViewProps) => {
  const { selectedDate, timeZone, alwaysShowAgendaDays, handleGotoDay } = useStore();

  const selectedDayjs = dayjs(selectedDate);

  const dates = useMemo(() => {
    if (view === 'week' && daysList) {
      return daysList.map((day) => dayjs(day));
    } else if (view === 'month') {
      const daysInMonth = selectedDayjs.daysInMonth();
      return Array.from({ length: daysInMonth }, (_, i) => selectedDayjs.date(i + 1));
    } else {
      return [selectedDayjs];
    }
  }, [view, daysList, selectedDayjs]);

  const hasEvents = useMemo(() => {
    return dates.some((date) => filterTodayAgendaEvents(events, date.toDate()).length > 0);
  }, [dates, events]);

  if (!alwaysShowAgendaDays && !hasEvents) {
    return <EmptyAgenda />;
  }

  return (
    <AgendaContainer>
      {dates.map((date) => {
        const dayEvents = filterTodayAgendaEvents(events, date.toDate());
        const today = isTimeZonedToday({ dateLeft: date.toDate(), timeZone });

        if (!alwaysShowAgendaDays && !dayEvents.length) return null;

        return (
          <AgendaDay
            key={date.valueOf()}
            day={date.toDate()}
            events={dayEvents}
            today={today}
            onDayClick={handleGotoDay}
          />
        );
      })}
    </AgendaContainer>
  );
});

AgendaView.displayName = 'AgendaView';
