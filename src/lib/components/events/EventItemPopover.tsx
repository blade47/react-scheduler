import { MouseEvent } from 'react';
import { Box, IconButton, Popover, Typography, useTheme } from '@mui/material';
import useStore from '../../hooks/useStore';
import { ProcessedEvent } from '@/lib';
import { PopperInner } from '../../theme/css.ts';
import EventActions from './Actions';
import { differenceInDaysOmitTime, getHourFormat } from '../../helpers/generals';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import { dayjs } from '@/config/dayjs';

interface EventItemPopoverProps {
  event: ProcessedEvent;
  anchorEl: Element | null;
  onTriggerViewer: (el?: MouseEvent) => void;
}

const EventItemPopover = ({ anchorEl, event, onTriggerViewer }: EventItemPopoverProps) => {
  const {
    triggerDialog,
    onDelete,
    events,
    handleState,
    triggerLoading,
    customViewer,
    viewerExtraComponent,
    fields,
    resources,
    resourceFields,
    viewerTitleComponent,
    viewerSubtitleComponent,
    hourFormat,
    translations,
    onEventEdit,
  } = useStore();

  const theme = useTheme();
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

      if (onDelete) {
        const remoteId = await onDelete(deletedId);
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

  const renderDateTime = () => {
    if (hideDates) return translations.event.allDay;

    const startDate = dayjs(event.start);
    const endDate = dayjs(event.end);
    return `${startDate.format(`DD MMMM YYYY ${hFormat}`)} - ${endDate.format(`DD MMMM YYYY ${hFormat}`)}`;
  };

  const handleClose = () => {
    onTriggerViewer();
  };

  const renderResources = () => {
    if (!hasResource.length) return null;

    return (
      <Typography
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        color="textSecondary"
        variant="caption"
        noWrap
      >
        <SupervisorAccountRoundedIcon />
        {hasResource.map((res) => res[resourceFields.textField]).join(', ')}
      </Typography>
    );
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {typeof customViewer === 'function' ? (
        customViewer(event, () => onTriggerViewer())
      ) : (
        <PopperInner>
          <Box
            sx={{
              bgcolor: event.color || theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <div className="rs__popper_actions">
              <div>
                <IconButton size="small" onClick={onTriggerViewer}>
                  <ClearRoundedIcon color="disabled" />
                </IconButton>
              </div>
              <EventActions event={event} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
            {viewerTitleComponent instanceof Function ? (
              viewerTitleComponent(event)
            ) : (
              <Typography style={{ padding: '5px 0' }} noWrap>
                {event.title}
              </Typography>
            )}
          </Box>
          <div style={{ padding: '5px 10px' }}>
            <Typography
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              color="textSecondary"
              variant="caption"
              noWrap
            >
              <EventNoteRoundedIcon />
              {renderDateTime()}
            </Typography>

            {viewerSubtitleComponent instanceof Function ? (
              viewerSubtitleComponent(event)
            ) : (
              <Typography variant="body2" style={{ padding: '5px 0' }}>
                {event.subtitle}
              </Typography>
            )}

            {renderResources()}

            {viewerExtraComponent instanceof Function
              ? viewerExtraComponent(fields, event)
              : viewerExtraComponent}
          </div>
        </PopperInner>
      )}
    </Popover>
  );
};

export default EventItemPopover;
