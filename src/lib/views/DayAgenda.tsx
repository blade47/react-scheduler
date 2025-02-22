import { useMemo } from 'react';
import { AgendaDiv } from '../theme/css.ts';
import { ProcessedEvent } from '@/lib';
import useStore from '../hooks/useStore';
import { Typography } from '@mui/material';
import { filterTodayAgendaEvents } from '../helpers/generals';
import AgendaEventsList from '../components/events/AgendaEventsList';
import EmptyAgenda from '../components/events/EmptyAgenda';
import { dayjs } from '@/config/dayjs';

type Props = {
  events: ProcessedEvent[];
};

const DayAgenda = ({ events }: Props) => {
  const { day, selectedDate, translations, alwaysShowAgendaDays } = useStore();

  const { headRenderer } = day!;

  const selectedDayjs = useMemo(() => dayjs(selectedDate), [selectedDate]);

  const dayEvents = useMemo(
    () => filterTodayAgendaEvents(events, selectedDate),
    [events, selectedDate]
  );

  if (!alwaysShowAgendaDays && !dayEvents.length) {
    return <EmptyAgenda />;
  }

  return (
    <AgendaDiv>
      <div className="rs__agenda_row rs__today_cell">
        <div className="rs__cell rs__agenda__cell">
          {typeof headRenderer === 'function' ? (
            <div>{headRenderer(selectedDate)}</div>
          ) : (
            <Typography variant="body2">{selectedDayjs.format('DD ddd')}</Typography>
          )}
        </div>
        <div className="rs__cell rs__agenda_items">
          {dayEvents.length > 0 ? (
            <AgendaEventsList day={selectedDate} events={dayEvents} />
          ) : (
            <Typography sx={{ padding: 1 }}>{translations.noDataToDisplay}</Typography>
          )}
        </div>
      </div>
    </AgendaDiv>
  );
};

export { DayAgenda };
