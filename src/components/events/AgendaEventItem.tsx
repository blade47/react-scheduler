import { memo, MouseEvent } from 'react';
import { ListItemAvatar, useTheme } from '@mui/material';
import { EventDateFormat, ProcessedEvent } from '@/types.ts';
import {
  AgendaEventContent,
  EventAvatar,
  EventListItem,
  EventTime,
  EventTitle,
} from '@/theme/css.ts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface Props {
  event: ProcessedEvent;
  onEventClick: (event: ProcessedEvent) => (e: MouseEvent) => void;
  startDate: EventDateFormat;
  endDate: EventDateFormat;
  disableViewer: boolean;
}

export const AgendaEventItem = memo(
  ({ event, onEventClick, startDate, endDate, disableViewer }: Props) => {
    const theme = useTheme();

    const getEventTitleInitialAsString = (event: ProcessedEvent) =>
      typeof event.title === 'string' ? event.title[0].toUpperCase() : ' ';

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
            {event.agendaAvatar || getEventTitleInitialAsString(event)}
          </EventAvatar>
        </ListItemAvatar>
        <AgendaEventContent>
          <EventTitle variant="subtitle1">{event.title}</EventTitle>
          <EventTime>
            <AccessTimeIcon fontSize="small" />
            {startDate.formatted} - {endDate.formatted}
          </EventTime>
        </AgendaEventContent>
      </EventListItem>
    );
  }
);
