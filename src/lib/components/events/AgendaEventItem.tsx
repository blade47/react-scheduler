import { memo } from 'react';
import { ListItemAvatar, ListItemText, useTheme } from '@mui/material';
import { AgendaEventItemProps } from '@/lib/types.ts';
import { EventAvatar, EventListItem } from '@/lib/theme/css.ts';

export const AgendaEventItem = memo(
  ({ event, onEventClick, startDate, endDate, disableViewer }: AgendaEventItemProps) => {
    const theme = useTheme();

    return (
      <EventListItem
        key={`${event.start.valueOf()}_${event.end.valueOf()}_${event.event_id}`}
        focusRipple
        disableRipple={disableViewer}
        tabIndex={disableViewer ? -1 : 0}
        disabled={event.disabled}
        onClick={onEventClick(event)}
      >
        <ListItemAvatar>
          <EventAvatar
            disabled={event.disabled}
            sx={{
              bgcolor: event.color || theme.palette.primary.main,
              color: event.textColor || theme.palette.primary.contrastText,
            }}
          >
            {event.agendaAvatar || ' '}
          </EventAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={event.title}
          secondary={`${startDate.formatted} - ${endDate.formatted}`}
        />
      </EventListItem>
    );
  }
);

AgendaEventItem.displayName = 'AgendaEventItem';
