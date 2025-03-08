import {
  Paper,
  alpha,
  Button,
  Typography,
  TypographyProps,
  Box,
  IconButton,
  MenuItem,
  ButtonBase,
  ListItemButton,
  Avatar,
  List,
  keyframes,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MODERN_STYLES } from '@/theme/common.ts';
import { ResourceViewMode } from '@/types.ts';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

export const SchedulerWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isDialog',
})<{ isDialog: boolean }>(({ theme, isDialog }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  userSelect: isDialog ? 'none' : 'auto',
  backgroundColor: theme.palette.background.default,
}));

export const SchedulerContent = styled('div')<{ resourceCount: number }>(
  ({ theme, resourceCount }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: resourceCount > 1 ? 'row' : 'column',
    width: '100%',
    flexGrow: 1,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(['box-shadow', 'background-color']),

    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  })
);

export const LoadingOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: theme.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(4px)',
  animation: `${fadeIn} 0.2s ease-in-out`,
}));

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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

export const PopperInner = styled('div')(() => ({
  maxWidth: '100%',
  width: 400,
  borderRadius: '8px',
  boxShadow: MODERN_STYLES.shadowMedium,
  '& > div': {
    '& .rs__popper_actions': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
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

export const NavigationContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: '0' | '1' }>(({ theme, sticky }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: sticky === '1' ? 'sticky' : 'relative',
  top: 0,
  zIndex: theme.zIndex.appBar,
  gap: theme.spacing(2),
  backdropFilter: 'blur(8px)',
}));

export const ViewNavigator = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ResourceListItem = styled('div')<{
  viewMode: ResourceViewMode;
  direction: 'ltr' | 'rtl';
}>(({ theme, viewMode, direction }) => ({
  padding: theme.spacing(1, 1.5),
  textAlign: direction === 'rtl' ? 'right' : 'left',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: theme.transitions.create(['background-color', 'box-shadow']),

  ...(viewMode === 'tabs' && {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),

  ...(viewMode === 'vertical' && {
    flexDirection: 'column',
    textAlign: 'center',
    position: 'sticky',
    top: theme.spacing(0.5),
    padding: theme.spacing(1.5),
  }),

  ...(viewMode === 'default' && {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  }),
}));

export const ResourceAvatar = styled('div')<{ color?: string }>(({ theme, color }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const ResourceContent = styled('div')<{ viewMode: ResourceViewMode }>(
  ({ theme, viewMode }) => ({
    flex: 1,
    minWidth: 0,
    ...(viewMode === 'vertical' && {
      textAlign: 'center',
      marginTop: theme.spacing(1),
    }),
  })
);

export const TabsContainer = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  alignSelf: 'center',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
}));

export const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  borderColor: theme.palette.divider,
  borderStyle: 'solid',
  borderWidth: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  minHeight: 48,

  '& .MuiTabs-scroller': {
    display: 'flex',
  },

  '& .MuiTabs-flexContainer': {
    display: 'flex',
    flex: 1,
  },

  '& .MuiTabs-indicator': {
    transition: theme.transitions.create(['background-color']),
    height: 3,

    '&.primary': {
      backgroundColor: theme.palette.primary.main,
    },
    '&.secondary': {
      backgroundColor: theme.palette.secondary.main,
    },
    '&.error': {
      backgroundColor: theme.palette.error.main,
    },
    '&.info': {
      backgroundColor: theme.palette.info.main,
    },
  },
}));

export const StyledTab = styled(MuiTab)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['color', 'background-color', 'border-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  margin: 0,
  padding: theme.spacing(1, 2),
  minWidth: 120,
  minHeight: 48,

  '&.Mui-selected': {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.action.selected,
  },

  '&:last-child': {
    borderRight: 'none',
  },

  '&:not(:last-of-type)': {
    marginRight: 0,
    [theme.breakpoints.up('sm')]: {
      marginRight: 0,
    },
  },
}));

export const TabPanel = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const CellButton = styled(Button)(({ theme }) => ({
  height: '100%',
  minHeight: 'inherit',
  padding: theme.spacing(1),
  borderRadius: 0,
  textTransform: 'none',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
    duration: theme.transitions.duration.shortest,
  }),

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:active': {
    backgroundColor: theme.palette.action.selected,
  },

  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[200],
    cursor: 'not-allowed',
  },

  '&.current': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },

  '&.dragging': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    boxShadow: theme.shadows[1],
  },
}));

interface StyledTypographyProps extends TypographyProps {
  isToday?: boolean;
  isClickable?: boolean;
}

export const DateNumber = styled(Typography, {
  shouldForwardProp: (prop) => !['isToday', 'isClickable'].includes(prop as string),
})<StyledTypographyProps>(({ theme, isToday, isClickable }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: isToday ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular,
  lineHeight: 1.2,
  color: 'inherit',
  ...(isClickable && {
    cursor: 'pointer',
    transition: theme.transitions.create('opacity'),
    '&:hover': {
      opacity: 0.8,
    },
  }),
}));

export const DateWeekday = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isToday',
})<StyledTypographyProps>(({ theme, isToday }) => ({
  fontWeight: isToday ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
  color: 'inherit',
  textTransform: 'uppercase',
  marginTop: theme.spacing(0.5),
}));

export const DateContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),

  '&.clickable': {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },

  '&.today': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export const ResourceContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: theme.spacing(1),
}));

export const VerticalResourceWrapper = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
}));

export const VerticalSidebar = styled(Box)(({ theme }) => ({
  borderColor: theme.palette.divider,
  borderStyle: 'solid',
  borderWidth: '1px 1px 0 1px',
  paddingTop: theme.spacing(1),
  flexBasis: 140,
  flexShrink: 0,
}));

export const VerticalContent = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  borderLeft: `1px solid ${theme.palette.divider}`,
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[300],
    borderRadius: 4,
  },
}));

export const DefaultResourceItem = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const ArrowButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shortest,
  }),

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  '&.Mui-disabled': {
    opacity: 0.5,
  },

  '& .MuiSvgIcon-root': {
    fontSize: 24,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },

  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
}));

export const MonthCell = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  minHeight: 100,
  padding: '4px',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',

  '&.outside-month': {
    backgroundColor: alpha(theme.palette.action.disabled, 0.05),
  },

  '&.today': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

export const MonthDateHeader = styled('div')(() => ({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '2px 4px',
  marginBottom: '4px',
  backgroundColor: 'inherit',
  minHeight: 28,
}));

export const MonthEventsContainer = styled('div')({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  position: 'relative',
});

export const MoreEventsButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: '2px 4px',
  minHeight: 20,
  justifyContent: 'flex-start',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.active, 0.05),
  },
}));

export const ViewMenuItem = styled(MenuItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  minWidth: 120,
  ...(selected && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));

export const EventWrapper = styled(Paper, {
  shouldForwardProp: (prop) =>
    !['disabled', 'view', 'isShortDuration', 'isMultiday'].includes(prop as string),
})<{
  disabled?: boolean;
  view?: 'day' | 'week' | 'month';
  isShortDuration?: boolean;
  isMultiday?: boolean;
}>(({ theme, disabled, view, isShortDuration, isMultiday }) => ({
  display: 'flex',
  width: '99%',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: disabled ? '#d0d0d0' : theme.palette.primary.main,
  color: disabled ? '#808080' : theme.palette.primary.contrastText,
  cursor: disabled ? 'default' : 'pointer',
  borderRadius: '6px',
  boxShadow: MODERN_STYLES.shadowLight,
  transition: MODERN_STYLES.transition,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,

  // View-specific styles
  ...(view === 'month' && {
    minHeight: '22px',
    fontSize: '0.8rem',
    margin: '1px 0',
  }),

  ...(view === 'day' && {
    minHeight: isShortDuration ? '22px' : '24px',
  }),

  ...(view === 'week' && {
    minHeight: '24px',
  }),

  // Short duration indicator
  ...(isShortDuration && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '3px',
    },
    paddingLeft: '8px',
  }),

  // Multi-day styles
  ...(isMultiday && {
    boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(to right, ${alpha(theme.palette.common.white, 0.1)}, transparent)`,
      pointerEvents: 'none',
    },
  }),
}));

export const EventButton = styled(ButtonBase)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  textAlign: 'left',
  padding: 0,
}));

export const MultidayContent = styled('div')(({ theme }) => ({
  padding: '2px 4px',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),

  '& .multiday-arrow': {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    width: '20px',
    justifyContent: 'center',
  },

  '& .multiday-time': {
    fontSize: '0.75rem',
    opacity: 0.9,
    whiteSpace: 'nowrap',
  },

  '& .multiday-title': {
    fontSize: '0.8rem',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export const PopoverContainer = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

export const PopoverHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

export const PopoverContent = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

export const InfoRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

export const EmptyContent = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  '& .rs__empty_icon': {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export const EventListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    boxShadow: theme.shadows[1],
  },

  '&.Mui-disabled': {
    opacity: 0.6,
    backgroundColor: alpha(theme.palette.action.disabled, 0.08),
  },
}));

export const EventAvatar = styled(Avatar)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  width: 40,
  height: 40,
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightMedium,
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow']),

  ...(disabled && {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
  }),

  '&:hover': {
    boxShadow: disabled ? 'none' : theme.shadows[2],
  },
}));

export const EventContent = styled('div')<{ view?: 'day' | 'week' | 'month' }>(({ view }) => ({
  padding: view === 'month' ? '2px 4px' : '4px 8px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  '& .event-time': {
    fontSize: view === 'month' ? '0.7rem' : '0.75rem',
    opacity: 0.9,
    whiteSpace: 'nowrap',
  },

  '& .event-title': {
    fontSize: view === 'month' ? '0.8rem' : '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },

  '& .event-subtitle': {
    fontSize: view === 'month' ? '0.7rem' : '0.75rem',
    opacity: 0.8,
  },
}));

export const AgendaEventContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const EventTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  letterSpacing: '0.015em',
}));

export const EventTime = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(14),
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const AgendaContainer = styled(Box)(({ theme }) => ({
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderWidth: '1px 1px 0 0',
}));

export const AgendaListContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

export const AgendaList = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiListItem-root': {
    marginBottom: theme.spacing(1),
  },
}));

export const AgendaRow = styled(Paper)(({ theme }) => ({
  display: 'flex',
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  transition: theme.transitions.create(['box-shadow', 'transform', 'background-color']),

  '&:hover': {
    boxShadow: theme.shadows[2],
  },

  '&.rs__today_cell': {
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },

  '& .rs__agenda__cell': {
    padding: theme.spacing(2),
    width: 100,
    minWidth: 100,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(theme.palette.background.default, 0.4),
  },

  '& .rs__agenda_items': {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const DayHeader = styled(Box)<{ today?: boolean }>(({ theme, today }) => ({
  textAlign: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'transform']),

  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },

  '& .day-number': {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: today ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
    color: today ? theme.palette.primary.main : theme.palette.text.primary,
    lineHeight: 1.2,
  },

  '& .day-name': {
    fontSize: theme.typography.body2.fontSize,
    color: today ? theme.palette.primary.main : theme.palette.text.secondary,
    textTransform: 'uppercase',
    marginTop: theme.spacing(0.5),
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.grey[50],
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .section-title': {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: theme.transitions.create(['opacity', 'transform']),
}));

export const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  backdropFilter: 'blur(8px)',
  transition: theme.transitions.create(['transform', 'background-color']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
  },
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.error.main, 0.2),
  },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  color: theme.palette.grey[900],
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.7),
  },
}));

export const ConfirmationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
}));
