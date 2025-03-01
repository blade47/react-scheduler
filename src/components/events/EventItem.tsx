import { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { getHourFormat } from '../../helpers/generals.tsx';
import useStore from '../../hooks/useStore.ts';
import useDragAttributes from '../../hooks/useDragAttributes.ts';
import useEventPermissions from '../../hooks/useEventPermissions.ts';
import { EventContentComponent } from './EventContent.tsx';
import { ProcessedEvent } from '@/types.ts';
import { EventButton, EventWrapper } from '@/theme/css.ts';
import EventItemPopover from '@/components/events/EventItemPopover.tsx';
import { dayjs } from '@/config/dayjs.ts';

export interface Props {
  event: ProcessedEvent;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

export const EventItem = ({ event, multiday, hasPrev, hasNext, showdate = true }: Props) => {
  const { hourFormat, eventRenderer, onEventClick, view, disableViewer } = useStore();

  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = getHourFormat(hourFormat);
  const { canDrag } = useEventPermissions(event);

  const triggerViewer = useCallback(
    (el?: MouseEvent) => {
      if (!el?.currentTarget && deleteConfirm) {
        setDeleteConfirm(false);
      }
      setAnchorEl(el?.currentTarget || null);
    },
    [deleteConfirm]
  );

  const renderEvent = useMemo(() => {
    if (typeof eventRenderer === 'function' && !multiday && view !== 'month') {
      const custom = eventRenderer({ event, onClick: triggerViewer, ...dragProps });
      if (custom) {
        return (
          <EventWrapper key={`${event.start.valueOf()}_${event.end.valueOf()}_${event.event_id}`}>
            {custom}
          </EventWrapper>
        );
      }
    }

    const durationInMinutes = dayjs(event.end).diff(dayjs(event.start), 'minute');
    const isShortDuration = durationInMinutes <= 30;

    return (
      <EventWrapper
        disabled={event.disabled}
        view={view}
        isShortDuration={isShortDuration}
        isMultiday={multiday}
        sx={{
          bgcolor: event.disabled ? '#d0d0d0' : event.color || theme.palette.primary.main,
          color: event.disabled ? '#808080' : event.textColor || theme.palette.primary.contrastText,
          ...(event.sx || {}),
        }}
        {...dragProps}
        draggable={canDrag && !event.disabled}
      >
        <EventButton
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disableViewer) {
              triggerViewer(e);
            }
            if (typeof onEventClick === 'function') {
              onEventClick(event);
            }
          }}
          focusRipple
          tabIndex={disableViewer ? -1 : 0}
          disableRipple={disableViewer}
          disabled={event.disabled}
        >
          <div>
            <EventContentComponent
              event={event}
              showTime={showdate}
              hFormat={hFormat}
              multiday={multiday}
              hasPrev={hasPrev}
              hasNext={hasNext}
              view={view}
            />
          </div>
        </EventButton>
      </EventWrapper>
    );
  }, [
    eventRenderer,
    multiday,
    view,
    event,
    theme.palette.primary.main,
    theme.palette.primary.contrastText,
    disableViewer,
    dragProps,
    canDrag,
    showdate,
    hFormat,
    hasPrev,
    hasNext,
    triggerViewer,
    onEventClick,
  ]);

  return (
    <Fragment>
      {renderEvent}
      <EventItemPopover anchorEl={anchorEl} event={event} onTriggerViewer={triggerViewer} />
    </Fragment>
  );
};

export default EventItem;
