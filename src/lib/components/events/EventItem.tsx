import { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { differenceInDaysOmitTime, getHourFormat } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import useDragAttributes from '../../hooks/useDragAttributes';
import useEventPermissions from '../../hooks/useEventPermissions';
import { EventContentComponent } from './EventContent';
import { EventItemProps } from '@/lib/types.ts';
import { EventButton, EventWrapper } from '@/lib/theme/css.ts';
import EventItemPopover from '@/lib/components/events/EventItemPopover.tsx';
import { dayjs } from '@/config/dayjs.ts';

export const EventItem = ({
  event,
  multiday,
  hasPrev,
  hasNext,
  showdate = true,
}: EventItemProps) => {
  const { hourFormat, eventRenderer, onEventClick, view, disableViewer } = useStore();

  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = getHourFormat(hourFormat);
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;
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
    const isShortEvent = durationInMinutes <= 15;

    return (
      <EventWrapper
        key={`${event.start.valueOf()}_${event.end.valueOf()}_${event.event_id}`}
        disabled={event.disabled}
        isShortEvent={isShortEvent}
        isMultiday={multiday}
        sx={{
          bgcolor: event.disabled ? '#d0d0d0' : event.color || theme.palette.primary.main,
          color: event.disabled ? '#808080' : event.textColor || theme.palette.primary.contrastText,
          ...(event.sx || {}),
        }}
        {...dragProps}
        draggable={canDrag}
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
              hideDates={hideDates ?? true}
              hFormat={hFormat}
              multiday={multiday}
              hasPrev={hasPrev}
              hasNext={hasNext}
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
    hideDates,
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
