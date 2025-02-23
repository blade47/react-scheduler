import { memo, useState } from 'react';
import { ProcessedEvent } from '@/lib';
import { getHourFormat, isTimeZonedToday } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import { AgendaEventItem } from './AgendaEventItem';
import { AgendaEventsListProps, EventDateFormat } from '@/lib/types.ts';
import { dayjs } from '@/config/dayjs.ts';
import EventItemPopover from '@/lib/components/events/EventItemPopover.tsx';
import { MouseEvent } from 'react';
import { AgendaList, AgendaListContainer } from '@/lib/theme/css.ts';

export const AgendaEventsList = memo(({ day, events }: AgendaEventsListProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent>();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const getEventDateFormat = (
    date: Date,
    day: Date,
    isStart: boolean,
    hFormat: string,
    timeZone?: string
  ): EventDateFormat => {
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

  const {
    hourFormat,
    eventRenderer,
    onEventClick: onEventClickProp,
    timeZone,
    disableViewer,
  } = useStore();

  const hFormat = getHourFormat(hourFormat);

  const triggerViewer = (el?: MouseEvent) => {
    if (!el?.currentTarget && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el?.currentTarget || null);
  };

  const handleEventClick = (event: ProcessedEvent) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disableViewer) {
      triggerViewer(e);
    }

    setSelectedEvent(event);

    if (typeof onEventClickProp === 'function') {
      onEventClickProp(event);
    }
  };

  const renderEvent = (event: ProcessedEvent) => {
    if (typeof eventRenderer === 'function') {
      return eventRenderer({ event, onClick: triggerViewer });
    }

    const startDate = getEventDateFormat(event.start, day, true, hFormat, timeZone);
    const endDate = getEventDateFormat(event.end, day, false, hFormat, timeZone);

    return (
      <AgendaEventItem
        key={event.event_id}
        event={event}
        onEventClick={handleEventClick}
        startDate={startDate}
        endDate={endDate}
        disableViewer={!!disableViewer}
      />
    );
  };

  return (
    <AgendaListContainer>
      <AgendaList disablePadding>{events.map(renderEvent)}</AgendaList>

      {selectedEvent && (
        <EventItemPopover
          anchorEl={anchorEl}
          event={selectedEvent}
          onTriggerViewer={triggerViewer}
        />
      )}
    </AgendaListContainer>
  );
});
