import { memo } from 'react';
import { dayjs } from '@/config/dayjs';
import useStore from '@/lib/hooks/useStore.ts';
import { AgendaDayProps } from '@/lib/types.ts';
import { AgendaRow, DayHeader } from '@/lib/theme/css.ts';
import { AgendaEventsList } from '@/lib/components/events/AgendaEventsList.tsx';
import { Typography } from '@mui/material';

export const AgendaDay = memo(({ day, events, today, onDayClick }: AgendaDayProps) => {
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
