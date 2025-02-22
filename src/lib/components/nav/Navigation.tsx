import { Fragment, useState } from 'react';
import { Button, useMediaQuery, Popover, MenuList, MenuItem, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WeekDateBtn } from './WeekDateBtn';
import { DayDateBtn } from './DayDateBtn';
import { MonthDateBtn } from './MonthDateBtn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import useStore from '../../hooks/useStore';
import { getTimeZonedDate } from '../../helpers/generals';
import { NavigationContainer, ViewNavigator } from '@/lib/theme/css.ts';

export type View = 'month' | 'week' | 'day';

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
  } = useStore();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const views = getViews();

  const toggleMoreMenu = (el?: Element) => {
    setAnchorEl(el || null);
  };

  const handleSelectedDateChange = (date: Date) => {
    handleState(date, 'selectedDate');
    if (typeof onSelectedDateChange === 'function') {
      onSelectedDateChange(date);
    }
  };

  const handleChangeView = (view: View) => {
    handleState(view, 'view');
    if (typeof onViewChange === 'function') {
      onViewChange(view, agenda);
    }
  };

  const handleTodayClick = () => {
    const today = getTimeZonedDate(new Date(), timeZone);
    handleSelectedDateChange(today);
  };

  const renderDateSelector = () => {
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
              weekProps={week!}
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
  };

  if (!navigation && disableViewNavigator) return null;

  return (
    <NavigationContainer sticky={stickyNavigation ? '1' : '0'}>
      <div data-testid="date-navigator">{navigation && renderDateSelector()}</div>

      <ViewNavigator
        data-testid="view-navigator"
        sx={{
          visibility: disableViewNavigator ? 'hidden' : 'visible',
        }}
      >
        {enableTodayButton && (
          <Button
            variant="outlined"
            onClick={handleTodayClick}
            aria-label={translations.navigation.today}
          >
            {translations.navigation.today}
          </Button>
        )}

        {enableAgenda &&
          (isDesktop ? (
            <Button
              variant="contained"
              color={agenda ? 'primary' : 'inherit'}
              onClick={toggleAgenda}
              aria-label={translations.navigation.agenda}
            >
              {translations.navigation.agenda}
            </Button>
          ) : (
            <IconButton color={agenda ? 'primary' : 'inherit'} onClick={toggleAgenda} size="small">
              <ViewAgendaIcon />
            </IconButton>
          ))}

        {views.length > 1 &&
          (isDesktop ? (
            views.map((v) => (
              <Button
                key={v}
                variant={v === view ? 'contained' : 'outlined'}
                color={v === view ? 'primary' : 'inherit'}
                onClick={() => handleChangeView(v)}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleChangeView(v);
                }}
              >
                {translations.navigation[v]}
              </Button>
            ))
          ) : (
            <Fragment>
              <IconButton size="small" onClick={(e) => toggleMoreMenu(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => toggleMoreMenu()}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                elevation={3}
              >
                <MenuList autoFocusItem={!!anchorEl}>
                  {views.map((v) => (
                    <MenuItem
                      key={v}
                      selected={v === view}
                      onClick={() => {
                        toggleMoreMenu();
                        handleChangeView(v);
                      }}
                      sx={{
                        minWidth: 120,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    >
                      {translations.navigation[v]}
                    </MenuItem>
                  ))}
                </MenuList>
              </Popover>
            </Fragment>
          ))}
      </ViewNavigator>
    </NavigationContainer>
  );
};
