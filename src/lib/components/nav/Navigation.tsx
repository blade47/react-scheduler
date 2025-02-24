import { NavigationContainer, ViewMenuItem, ViewNavigator } from '@/lib/theme/css';
import { View } from '@/lib/types';
import { Button, IconButton, MenuList, Popover, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import useStore from '@/lib/hooks/useStore.ts';
import { getTimeZonedDate, isDateInRange } from '@/lib/helpers/generals';
import { MonthDateBtn } from '@/lib/components/nav/MonthDateBtn.tsx';
import { WeekDateBtn } from '@/lib/components/nav/WeekDateBtn.tsx';
import { DayDateBtn } from '@/lib/components/nav/DayDateBtn.tsx';

const ViewSelector = ({
  views,
  currentView,
  onChange,
  translations,
}: {
  views: View[];
  currentView: View;
  onChange: (view: View) => void;
  translations: any;
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  if (isDesktop) {
    return (
      <>
        {views.map((view) => (
          <Button
            key={view}
            variant={view === currentView ? 'contained' : 'outlined'}
            sx={{
              minWidth: 88,
              fontWeight: 500,
              textTransform: 'capitalize',
              ...(view === currentView
                ? {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }
                : {
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: theme.palette.primary.main,
                    },
                  }),
            }}
            onClick={() => onChange(view)}
            onDragOver={(e) => {
              e.preventDefault();
              onChange(view);
            }}
          >
            {translations.navigation[view]}
          </Button>
        ))}
      </>
    );
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        elevation={3}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <MenuList autoFocusItem={!!anchorEl}>
          {views.map((v) => (
            <ViewMenuItem
              key={v}
              selected={v === currentView}
              onClick={() => {
                handleClose();
                onChange(v);
              }}
              sx={{
                minHeight: 42,
                px: 2,
                ...(v === currentView && {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                  color: theme.palette.primary.contrastText,
                }),
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {translations.navigation[v]}
            </ViewMenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

const AgendaButton = ({
  isAgendaActive,
  onToggle,
  translations,
}: {
  isAgendaActive: boolean;
  onToggle: () => void;
  translations: any;
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  if (isDesktop) {
    return (
      <Button
        variant={isAgendaActive ? 'contained' : 'outlined'}
        onClick={onToggle}
        aria-label={translations.navigation.agenda}
        sx={{
          minWidth: 88,
          fontWeight: 500,
          textTransform: 'capitalize',
          ...(isAgendaActive
            ? {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }
            : {
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.main,
                },
              }),
        }}
      >
        {translations.navigation.agenda}
      </Button>
    );
  }

  return (
    <IconButton
      onClick={onToggle}
      size="small"
      sx={{
        color: isAgendaActive ? theme.palette.primary.main : theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <ViewAgendaIcon />
    </IconButton>
  );
};

export const Navigation = () => {
  const {
    selectedDate,
    view,
    week,
    handleState,
    getViews,
    translations,
    navigation,
    day,
    month,
    disableViewNavigator,
    onSelectedDateChange,
    onViewChange,
    stickyNavigation,
    timeZone,
    agenda,
    toggleAgenda,
    enableAgenda,
    enableTodayButton,
    minDate,
    maxDate,
  } = useStore();

  const theme = useTheme();

  const handleSelectedDateChange = useCallback(
    (date: Date) => {
      handleState(date, 'selectedDate');
      onSelectedDateChange?.(date);
    },
    [handleState, onSelectedDateChange]
  );

  const handleChangeView = useCallback(
    (newView: View) => {
      handleState(newView, 'view');
      onViewChange?.(newView, agenda);
    },
    [handleState, onViewChange, agenda]
  );

  const canNavigateToToday = useCallback(
    () =>
      isDateInRange(getTimeZonedDate(new Date(), timeZone), minDate, maxDate) &&
      (enableTodayButton ?? false),
    [enableTodayButton, maxDate, minDate, timeZone]
  );

  const handleTodayClick = useCallback(() => {
    if (!canNavigateToToday()) return;
    const today = getTimeZonedDate(new Date(), timeZone);
    handleSelectedDateChange(today);
  }, [canNavigateToToday, timeZone, handleSelectedDateChange]);

  const renderDateSelector = useCallback(() => {
    switch (view) {
      case 'month':
        return (
          month?.navigation && (
            <MonthDateBtn selectedDate={selectedDate} onChange={handleSelectedDateChange} />
          )
        );
      case 'week':
        return (
          week?.navigation && (
            <WeekDateBtn
              selectedDate={selectedDate}
              onChange={handleSelectedDateChange}
              weekProps={week}
            />
          )
        );
      case 'day':
        return (
          day?.navigation && (
            <DayDateBtn selectedDate={selectedDate} onChange={handleSelectedDateChange} />
          )
        );
      default:
        return null;
    }
  }, [view, month, week, day, selectedDate, handleSelectedDateChange]);

  if (!navigation && disableViewNavigator) return null;

  const views = getViews();

  return (
    <NavigationContainer sticky={stickyNavigation ? '1' : '0'}>
      <div data-testid="date-navigator">{navigation && renderDateSelector()}</div>

      <ViewNavigator
        data-testid="view-navigator"
        sx={{
          visibility: disableViewNavigator ? 'hidden' : 'visible',
          gap: 1,
        }}
      >
        {canNavigateToToday() && (
          <Button
            variant="outlined"
            onClick={handleTodayClick}
            aria-label={translations.navigation.today}
            sx={{
              minWidth: 88,
              fontWeight: 500,
              textTransform: 'capitalize',
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {translations.navigation.today}
          </Button>
        )}

        {enableAgenda && (
          <AgendaButton
            isAgendaActive={agenda ?? false}
            onToggle={toggleAgenda}
            translations={translations}
          />
        )}

        {views.length > 1 && (
          <ViewSelector
            views={views}
            currentView={view}
            onChange={handleChangeView}
            translations={translations}
          />
        )}
      </ViewNavigator>
    </NavigationContainer>
  );
};
