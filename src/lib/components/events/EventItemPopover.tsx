import { memo } from 'react';
import { Popover } from '@mui/material';
import { PopoverContentComponent } from './PopoverContent';
import { PopperInner } from '../../theme/css';
import useStore from '../../hooks/useStore';
import { differenceInDaysOmitTime, getHourFormat } from '../../helpers/generals';
import { dayjs } from '@/config/dayjs';
import { EventItemPopoverProps } from '@/lib/types.ts';

export const EventItemPopover = memo(
  ({ anchorEl, event, onTriggerViewer }: EventItemPopoverProps) => {
    const {
      triggerDialog,
      onDelete: onDeleteProp,
      events,
      handleState,
      triggerLoading,
      customViewer,
      resources,
      resourceFields,
      hourFormat,
      translations,
      onEventEdit,
    } = useStore();

    const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;
    const hFormat = getHourFormat(hourFormat);
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
      return `${startDate.format(`DD MMMM YYYY ${hFormat}`)} - ${endDate.format(`DD MMMM YYYY ${hFormat}`)}`;
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
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
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
  }
);

EventItemPopover.displayName = 'EventItemPopover';

export default EventItemPopover;
