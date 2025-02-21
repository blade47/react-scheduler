import { Paper, alpha, styled } from '@mui/material';

const MODERN_STYLES = {
  shadowLight: '0 2px 8px rgba(0, 0, 0, 0.08)',
  shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.2s ease-in-out',
};

export const Wrapper = styled('div')<{ dialog: number }>(({ theme, dialog }) => ({
  position: 'relative',
  '& .rs__table_loading': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999999,
    '& .rs__table_loading_internal': {
      background: dialog ? '' : alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(4px)', // Modern blur effect
      height: '100%',
      '& > span': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        '& >span': {
          marginBottom: 15,
        },
      },
    },
  },
}));

export const Table = styled('div')<{ resource_count: number }>(({ resource_count }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: resource_count > 1 ? 'row' : 'column',
  width: '100%',
  boxSizing: 'content-box',
  '& > div': {
    flexShrink: 0,
    flexGrow: 1,
  },
}));

export const NavigationDiv = styled(Paper)<{ sticky?: string }>(({ sticky = '0', theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: sticky === '1' ? 'sticky' : 'relative',
  top: sticky === '1' ? 0 : undefined,
  zIndex: sticky === '1' ? 999 : undefined,
  boxShadow: 'none',
  padding: '8px 16px',
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(8px)',
  '& > .rs__view_navigator': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}));

export const AgendaDiv = styled('div')(({ theme }) => ({
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderWidth: '1px 1px 0 0',
  '& > .rs__agenda_row': {
    display: 'flex',
    '& >.rs__agenda__cell': {
      padding: '8px 12px',
      width: '100%',
      maxWidth: 60,
      '& > .MuiTypography-root': {
        position: 'sticky',
        top: 0,
        '&.rs__hover__op': {
          cursor: 'pointer',
          transition: MODERN_STYLES.transition,
          '&:hover': {
            opacity: 0.8,
            color: theme.palette.primary.main,
          },
        },
      },
    },
    '& .rs__cell': {
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
      borderWidth: '0 0 1px 1px',
    },
    '& > .rs__agenda_items': {
      flexGrow: 1,
    },
  },
}));

export const TableGrid = styled('div')<{
  days: number;
  sticky?: string;
  stickyNavigation?: boolean;
  indent?: string;
}>(({ days, sticky = '0', stickyNavigation, indent = '1', theme }) => ({
  display: 'grid',
  gridTemplateColumns:
    +indent > 0
      ? `80px repeat(${days}, minmax(120px, 1fr))`
      : `repeat(${days}, minmax(120px, 1fr))`,
  overflowX: 'auto',
  overflowY: 'hidden',
  position: sticky === '1' ? 'sticky' : 'relative',
  top: sticky === '1' ? (stickyNavigation ? 36 : 0) : undefined,
  zIndex: sticky === '1' ? 99 : undefined,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: +indent > 0 ? `60px repeat(${days}, minmax(100px, 1fr))` : '',
  },
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderWidth: '0 0 0 1px',
  '&:first-of-type': {
    borderWidth: '1px 0 0 1px',
  },
  '&:last-of-type': {
    borderWidth: '0 0 1px 1px',
  },
  '& .rs__cell': {
    background: theme.palette.background.paper,
    position: 'relative',
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    borderWidth: '0 1px 1px 0',
    transition: MODERN_STYLES.transition,
    '&.rs__header': {
      minHeight: '50px',
      background: theme.palette.background.paper,
      '& > :first-of-type': {
        padding: '8px 12px',
        whiteSpace: 'nowrap',
      },
    },
    '&.rs__header__center': {
      padding: '8px 12px',
    },
    '&.rs__time': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'sticky',
      left: 0,
      zIndex: 99,
      minWidth: '60px',
      color: theme.palette.text.secondary,
      [theme.breakpoints.down('sm')]: {
        writingMode: 'vertical-rl',
      },
    },
    '& > button': {
      width: '100%',
      height: '100%',
      borderRadius: 0,
      cursor: 'pointer',
      transition: MODERN_STYLES.transition,
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.08),
      },
    },
    '& .rs__event__item': {
      position: 'absolute',
      zIndex: 1,
    },
    '& .rs__multi_day': {
      position: 'absolute',
      zIndex: 1,
      textOverflow: 'ellipsis',
    },
    '& .rs__block_col': {
      display: 'block',
      position: 'relative',
    },
    '& .rs__hover__op': {
      cursor: 'pointer',
      transition: MODERN_STYLES.transition,
      '&:hover': {
        opacity: 0.8,
        color: theme.palette.primary.main,
      },
    },
  },
}));

export const EventItemPaper = styled(Paper)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  width: 'calc(100% - 4px)',
  height: 'calc(100% - 4px)',
  margin: '2px',
  display: 'block',
  cursor: disabled ? 'not-allowed' : 'pointer',
  overflow: 'hidden',
  borderRadius: '6px',
  boxShadow: MODERN_STYLES.shadowLight,
  transition: MODERN_STYLES.transition,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),

  '&:hover': {
    transform: disabled ? 'none' : 'translateY(-1px)',
    boxShadow: disabled ? MODERN_STYLES.shadowLight : MODERN_STYLES.shadowMedium,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  '& .MuiButtonBase-root': {
    width: '100%',
    height: '100%',
    display: 'block',
    textAlign: 'left',
    padding: '4px 8px',
    '& > div': {
      height: '100%',
    },
  },
}));

export const PopperInner = styled('div')(() => ({
  maxWidth: '100%',
  width: 400,
  borderRadius: '8px',
  boxShadow: MODERN_STYLES.shadowMedium,
  '& > div': {
    padding: '12px 16px',
    '& .rs__popper_actions': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    },
  },
}));

export const EventActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  '& .MuiIconButton-root': {
    color: theme.palette.primary.main,
    transition: MODERN_STYLES.transition,
  },
  '& .MuiButton-root': {
    borderRadius: '6px',
    transition: MODERN_STYLES.transition,
    '&.delete': {
      color: theme.palette.error.main,
      '&:hover': {
        background: alpha(theme.palette.error.main, 0.08),
      },
    },
    '&.cancel': {
      color: theme.palette.text.secondary,
      '&:hover': {
        background: alpha(theme.palette.action.active, 0.08),
      },
    },
  },
}));

export const TimeIndicatorBar = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 9,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  '& > div:first-of-type': {
    height: 10,
    width: 10,
    borderRadius: '50%',
    background: theme.palette.error.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
    marginLeft: -5,
  },
  '& > div:last-of-type': {
    borderTop: `solid 2px ${theme.palette.error.main}`,
    width: '100%',
    opacity: 0.7,
  },
}));
