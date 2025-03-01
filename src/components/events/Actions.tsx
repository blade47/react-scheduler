import { Box, Grow, Slide, Typography } from '@mui/material';
import { FC, useState } from 'react';
import {
  ActionIconButton,
  ActionsContainer,
  CancelButton,
  ConfirmationContainer,
  DeleteButton,
} from '@/theme/css.ts';
import { ProcessedEvent } from '@/index.tsx';
import useStore from '../../hooks/useStore.ts';
import useEventPermissions from '../../hooks/useEventPermissions.ts';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface Props {
  event: ProcessedEvent;
  onDelete(): void;
  onEdit(): void;
}

const EventActions: FC<Props> = ({ event, onDelete, onEdit }) => {
  const { translations, direction } = useStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { canEdit, canDelete } = useEventPermissions(event);

  const handleDelete = () => {
    if (!deleteConfirm) {
      return setDeleteConfirm(true);
    }
    onDelete();
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 40, display: 'flex', alignItems: 'center' }}>
      <Grow in={!deleteConfirm} timeout={1} style={{ transformOrigin: 'center right' }}>
        <ActionsContainer>
          {canEdit && (
            <ActionIconButton size="small" onClick={onEdit} title={translations.form.editTitle}>
              <EditRoundedIcon fontSize="small" />
            </ActionIconButton>
          )}
          {canDelete && (
            <ActionIconButton size="small" onClick={handleDelete} title={translations.form.delete}>
              <DeleteRoundedIcon fontSize="small" />
            </ActionIconButton>
          )}
        </ActionsContainer>
      </Grow>

      <Slide
        in={deleteConfirm}
        direction={direction === 'rtl' ? 'right' : 'left'}
        timeout={1}
        unmountOnExit
      >
        <ConfirmationContainer>
          <ErrorOutlineRoundedIcon fontSize="small" color="error" sx={{ ml: 0.5 }} />
          <Typography
            variant="caption"
            sx={{
              color: 'error.main',
              fontWeight: 500,
            }}
          >
            {translations.form.confirm}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <DeleteButton size="small" onClick={handleDelete} variant="contained" disableElevation>
              {translations.form.delete}
            </DeleteButton>
            <CancelButton
              size="small"
              onClick={handleCancelDelete}
              variant="contained"
              disableElevation
            >
              {translations.form.cancel}
            </CancelButton>
          </Box>
        </ConfirmationContainer>
      </Slide>
    </Box>
  );
};

export default EventActions;
