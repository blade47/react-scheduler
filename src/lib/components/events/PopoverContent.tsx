import { Typography, IconButton } from '@mui/material';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import { useTheme } from '@mui/material';
import { ProcessedEvent } from '@/lib/types.ts';
import { InfoRow, PopoverActions, PopoverContent, PopoverHeader } from '@/lib/theme/css.ts';
import useStore from '@/lib/hooks/useStore.ts';
import EventActions from '@/lib/components/events/Actions.tsx';

export interface Props {
  event: ProcessedEvent;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onEdit: () => void;
  dateTimeText: string;
  resourcesText: string | null;
}

export const PopoverContentComponent = ({
  event,
  onClose,
  onDelete,
  onEdit,
  dateTimeText,
  resourcesText,
}: Props) => {
  const { viewerTitleComponent, viewerSubtitleComponent, viewerExtraComponent, fields } =
    useStore();
  const theme = useTheme();

  return (
    <>
      <PopoverHeader
        sx={{
          bgcolor: event.color || theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <PopoverActions className="rs__popper_actions">
          <IconButton size="small" onClick={onClose}>
            <ClearRoundedIcon color="disabled" />
          </IconButton>
          <EventActions event={event} onDelete={onDelete} onEdit={onEdit} />
        </PopoverActions>

        {viewerTitleComponent instanceof Function ? (
          viewerTitleComponent(event)
        ) : (
          <Typography sx={{ py: 0.5 }} noWrap>
            {event.title}
          </Typography>
        )}
      </PopoverHeader>

      <PopoverContent>
        <InfoRow>
          <EventNoteRoundedIcon fontSize="small" color="action" />
          <Typography color="textSecondary" variant="caption" noWrap>
            {dateTimeText}
          </Typography>
        </InfoRow>

        {viewerSubtitleComponent instanceof Function
          ? viewerSubtitleComponent(event)
          : event.subtitle && (
              <Typography variant="body2" sx={{ py: 0.5 }}>
                {event.subtitle}
              </Typography>
            )}

        {resourcesText && (
          <InfoRow>
            <SupervisorAccountRoundedIcon fontSize="small" color="action" />
            <Typography color="textSecondary" variant="caption" noWrap>
              {resourcesText}
            </Typography>
          </InfoRow>
        )}

        {viewerExtraComponent instanceof Function
          ? viewerExtraComponent(fields, event)
          : viewerExtraComponent}
      </PopoverContent>
    </>
  );
};
