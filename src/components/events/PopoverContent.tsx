import { Typography, IconButton, Stack, Box, Chip } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import { useTheme } from '@mui/material';
import { ProcessedEvent } from '@/types.ts';
import { InfoRow, PopoverContainer, PopoverContent, PopoverHeader } from '@/theme/css.ts';
import useStore from '@/hooks/useStore.ts';
import EventActions from '@/components/events/Actions.tsx';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Time = ({ time }: { time: string }) => (
  <Box sx={{ mb: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Chip
        icon={<AccessTimeIcon />}
        label={time}
        size="small"
        color="primary"
        variant="outlined"
      />
    </Stack>
  </Box>
);

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
    <PopoverContainer>
      <PopoverHeader sx={{ bgcolor: event.color || theme.palette.primary.main }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: theme.palette.primary.contrastText }}
          >
            <ClearRoundedIcon />
          </IconButton>
          <EventActions event={event} onDelete={onDelete} onEdit={onEdit} />
        </Stack>

        {viewerTitleComponent instanceof Function ? (
          viewerTitleComponent(event)
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
            {event.title}
          </Typography>
        )}
      </PopoverHeader>

      <PopoverContent direction="column">
        <InfoRow direction="row">
          <Time time={dateTimeText} />
        </InfoRow>

        {viewerSubtitleComponent instanceof Function
          ? viewerSubtitleComponent(event)
          : event.subtitle && (
              <Typography variant="body2" sx={{ py: 0.5 }}>
                {event.subtitle}
              </Typography>
            )}

        {resourcesText && (
          <InfoRow direction="row">
            <SupervisorAccountRoundedIcon fontSize="small" color="action" />
            <Typography color="textSecondary" variant="body2" noWrap>
              {resourcesText}
            </Typography>
          </InfoRow>
        )}

        {viewerExtraComponent instanceof Function
          ? viewerExtraComponent(fields, event)
          : viewerExtraComponent}
      </PopoverContent>
    </PopoverContainer>
  );
};
