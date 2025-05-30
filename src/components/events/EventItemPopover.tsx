import { memo, MouseEvent } from 'react';
import { Popover } from '@mui/material';
import { PopoverContentComponent } from './PopoverContent.tsx';
import { PopperInner } from '@/theme/css.ts';
import useStore from '../../hooks/useStore.ts';
import { differenceInDaysOmitTime } from '../../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';
import { ProcessedEvent } from '@/types.ts';

export interface Props {
  event: ProcessedEvent;
  anchorEl: Element | null;
  onTriggerViewer: (el?: MouseEvent) => void;
}

export const EventItemPopover = memo(({ anchorEl, event, onTriggerViewer }: Props) => {
  const {
    triggerDialog,
    onDelete: onDeleteProp,
    events,
    handleState,
    triggerLoading,
    customViewer,
    resources,
    resourceFields,
    translations,
    onEventEdit,
  } = useStore();

  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;
  const idKey = resourceFields.idField;

  const hasResource = resources.filter((res) =>
    Array.isArray(event[idKey]) ? event[idKey].includes(res[idKey]) : res[idKey] === event[idKey]
  );

  const handleDelete = async () => {
    try {
      triggerLoading(true);
      let deletedId = event.event_id;

      if (onDeleteProp) {
        const remoteId = await onDeleteProp(deletedId);
        deletedId = remoteId || '';
      }

      if (deletedId) {
        onTriggerViewer();
        const updatedEvents = events.filter((e) => e.event_id !== deletedId);
        handleState(updatedEvents, 'events');
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };

  const handleEdit = () => {
    onTriggerViewer();
    triggerDialog(true, event);
    if (typeof onEventEdit === 'function') {
      onEventEdit(event);
    }
  };

  const getDateTimeText = () => {
    if (hideDates) return translations.event.allDay;

    const startDate = dayjs(event.start);
    const endDate = dayjs(event.end);

    return `${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;
  };

  const getResourcesText = () => {
    if (!hasResource.length) return null;
    return hasResource.map((res) => res[resourceFields.textField]).join(', ');
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => onTriggerViewer()}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
      slotProps={{
        paper: {
          sx: {
            height: 'auto',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {typeof customViewer === 'function' ? (
        customViewer(event, () => onTriggerViewer())
      ) : (
        <PopperInner>
          <PopoverContentComponent
            event={event}
            onClose={() => onTriggerViewer()}
            onDelete={handleDelete}
            onEdit={handleEdit}
            dateTimeText={getDateTimeText()}
            resourcesText={getResourcesText()}
          />
        </PopperInner>
      )}
    </Popover>
  );
});

EventItemPopover.displayName = 'EventItemPopover';

export default EventItemPopover;
