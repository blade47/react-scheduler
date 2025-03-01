import { memo } from 'react';
import { dayjs } from '@/config/dayjs.ts';
import useStore from '@/hooks/useStore.ts';
import { ProcessedEvent } from '@/types.ts';
import { AgendaRow, DayHeader } from '@/theme/css.ts';
import { AgendaEventsList } from '@/components/events/AgendaEventsList.tsx';
import { Typography } from '@mui/material';

export interface Props {
  day: Date;
  events: ProcessedEvent[];
  today: boolean;
  onDayClick?: (day: Date) => void;
}

export const AgendaDay = memo(({ day, events, today, onDayClick }: Props) => {
  const { headRenderer } = useStore().day!;
  const dayJsDate = dayjs(day);

  const handleDayClick = () => {
    if (onDayClick) {
      onDayClick(dayJsDate.toDate());
    }
  };

  return (
    <AgendaRow elevation={0} className={`rs__agenda_row ${today ? 'rs__today_cell' : ''}`}>
      <div className="rs__cell rs__agenda__cell">
        {typeof headRenderer === 'function' ? (
          <div>{headRenderer(dayJsDate.toDate())}</div>
        ) : (
          <DayHeader onClick={handleDayClick}>
            <Typography className="day-number">{dayJsDate.format('DD')}</Typography>
            <Typography className="day-name">{dayJsDate.format('ddd')}</Typography>
          </DayHeader>
        )}
      </div>
      <div className="rs__agenda_items">
        <AgendaEventsList day={dayJsDate.toDate()} events={events} />
      </div>
    </AgendaRow>
  );
});

AgendaDay.displayName = 'AgendaDay';
