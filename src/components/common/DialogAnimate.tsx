import { Dialog, DialogProps } from '@mui/material';

export interface Props extends DialogProps {
  onClose?: VoidFunction;
}

const DialogAnimate = ({ open = false, onClose, children, sx, ...other }: Props) => {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      TransitionProps={{
        timeout: {
          enter: 400,
          exit: 300,
        },
      }}
      PaperProps={{
        sx: {
          transition: `
            width 400ms cubic-bezier(0.23, 1, 0.32, 1),
            min-height 400ms cubic-bezier(0.23, 1, 0.32, 1),
            max-width 400ms cubic-bezier(0.23, 1, 0.32, 1),
            opacity 400ms cubic-bezier(0.23, 1, 0.32, 1)
          `,
          opacity: open ? 1 : 0,
          ...sx,
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)',
        },
      }}
      {...other}
    >
      {children}
    </Dialog>
  );
};

DialogAnimate.displayName = 'DialogAnimate';

export default DialogAnimate;
