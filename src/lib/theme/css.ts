import { Paper, alpha, Button, Typography, TypographyProps, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MODERN_STYLES } from '@/lib/theme/common.ts';
import { ResourceViewMode } from '@/lib/types.ts';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

export const Wrapper = styled('div')<{ dialog: number }>(({ theme, dialog }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  userSelect: dialog ? 'none' : 'auto',

  '& .rs__table_loading': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999999,
    '& .rs__table_loading_internal': {
      background: dialog ? '' : alpha(theme.palette.background.paper, 0.6),
      backdropFilter: 'blur(4px)',
      height: '100%',
      '& > span': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        '& > span': {
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

export const AgendaDiv = styled('div')(({ theme }) => ({
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderWidth: '1px 1px 0 0',
  '& > .rs__agenda_row': {
    display: 'flex',
    '& > .rs__agenda__cell': {
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
  display: 'grid',
  backgroundColor: theme.palette.background.paper,

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

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '&.Mui-selected': {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.action.selected,
  },

  '&:last-child': {
    borderRight: 'none',
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

  '&.disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
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
  fontSize: theme.typography.h6.fontSize,
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
