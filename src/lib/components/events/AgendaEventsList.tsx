import { Fragment, MouseEvent, useState } from 'react';
import {
  useTheme,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { ProcessedEvent } from '@/lib';
import { getHourFormat, isTimeZonedToday } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import EventItemPopover from './EventItemPopover';
import { dayjs } from '@/config/dayjs';

interface AgendaEventsListProps {
  day: Date;
  events: ProcessedEvent[];
}

interface EventDateFormat {
  isToday: boolean;
  format: string;
  formatted: string;
}

const AgendaEventsList = ({ day, events }: AgendaEventsListProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { hourFormat, eventRenderer, onEventClick, timeZone, disableViewer } = useStore();

  const theme = useTheme();
  const hFormat = getHourFormat(hourFormat);

  const triggerViewer = (el?: MouseEvent) => {
    if (!el?.currentTarget && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el?.currentTarget || null);
  };

  const getEventDateFormat = (date: Date, isStart: boolean): EventDateFormat => {
    const isToday = isTimeZonedToday({
      dateLeft: date,
      dateRight: day,
      timeZone,
    });

    const format = isToday ? hFormat : `MMM ${isStart ? 'd' : 'D'}, ${hFormat}`;
    const formatted = dayjs(date).format(format);

    return {
      isToday,
      format,
      formatted,
    };
  };

  const handleEventClick = (event: ProcessedEvent) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disableViewer) {
      triggerViewer(e);
    }

    setSelectedEvent(event);

    if (typeof onEventClick === 'function') {
      onEventClick(event);
    }
  };

  const renderEvent = (event: ProcessedEvent) => {
    if (typeof eventRenderer === 'function') {
      return eventRenderer({ event, onClick: triggerViewer });
    }

    const startDate = getEventDateFormat(event.start, true);
    const endDate = getEventDateFormat(event.end, false);

    return (
      <ListItemButton
        key={`${event.start.valueOf()}_${event.end.valueOf()}_${event.event_id}`}
        focusRipple
        disableRipple={disableViewer}
        tabIndex={disableViewer ? -1 : 0}
        disabled={event.disabled}
        onClick={handleEventClick(event)}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: event.disabled ? '#d0d0d0' : event.color || theme.palette.primary.main,
              color: event.disabled
                ? '#808080'
                : event.textColor || theme.palette.primary.contrastText,
            }}
          >
            {event.agendaAvatar || ' '}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={event.title}
          secondary={`${startDate.formatted} - ${endDate.formatted}`}
        />
      </ListItemButton>
    );
  };

  return (
    <Fragment>
      <List>{events.map(renderEvent)}</List>

      {selectedEvent && (
        <EventItemPopover
          anchorEl={anchorEl}
          event={selectedEvent}
          onTriggerViewer={triggerViewer}
        />
      )}
    </Fragment>
  );
};

export default AgendaEventsList;
