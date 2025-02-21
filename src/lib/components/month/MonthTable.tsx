import { Avatar, Typography, useTheme } from '@mui/material';
import { Fragment, useCallback } from 'react';
import {
  getHourFormat,
  getRecurrencesForDate,
  getResourcedEvents,
  isTimeZonedToday,
  sortEventsByTheEarliest,
} from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import useSyncScroll from '../../hooks/useSyncScroll';
import { TableGrid } from '../../styles/styles';
import { DefaultResource } from '@/lib';
import Cell from '../common/Cell';
import MonthEvents from '../events/MonthEvents';
import { dayjs } from '@/config/dayjs';

type Props = {
  daysList: Date[];
  resource?: DefaultResource;
  eachWeekStart: Date[];
};

const MonthTable = ({ daysList, resource, eachWeekStart }: Props) => {
  const {
    height,
    month,
    selectedDate,
    events,
    handleGotoDay,
    resourceFields,
    fields,
    hourFormat,
    stickyNavigation,
    timeZone,
    onClickMore,
  } = useStore();

  const { weekDays, startHour, endHour, cellRenderer, headRenderer, disableGoToDay } = month!;
  const { headersRef, bodyRef } = useSyncScroll();

  const theme = useTheme();
  const selectedDayjs = dayjs(selectedDate);
  const monthStart = selectedDayjs.startOf('month');
  const hFormat = getHourFormat(hourFormat);
  const CELL_HEIGHT = height / eachWeekStart.length;

  const renderCells = useCallback(
    (resource?: DefaultResource) => {
      let resourcedEvents = sortEventsByTheEarliest(events);
      if (resource) {
        resourcedEvents = getResourcedEvents(events, resource, resourceFields, fields);
      }
      const rows: JSX.Element[] = [];

      for (const startDay of eachWeekStart) {
        const startDayjs = dayjs(startDay);
        const cells = weekDays.map((d) => {
          const today = startDayjs.add(d, 'day').toDate();
          const todayDayjs = dayjs(today);

          const start = todayDayjs.hour(startHour).format(`YYYY/MM/DD ${hFormat}`);

          const end = todayDayjs.hour(endHour).format(`YYYY/MM/DD ${hFormat}`);

          const field = resourceFields.idField;
          const eachFirstDayInCalcRow = startDayjs.isSame(today, 'day') ? today : null;

          const todayEvents = resourcedEvents
            .flatMap((e) => getRecurrencesForDate(e, today))
            .filter((e) => {
              const eventStart = dayjs(e.start);
              if (eventStart.isSame(today, 'day')) return true;

              const dayInterval = {
                start: eventStart.startOf('day'),
                end: dayjs(e.end).endOf('day'),
              };

              return !!(
                eachFirstDayInCalcRow &&
                dayjs(eachFirstDayInCalcRow).isBetween(
                  dayInterval.start,
                  dayInterval.end,
                  'day',
                  '[]'
                )
              );
            });

          const isToday = isTimeZonedToday({ dateLeft: today, timeZone });

          return (
            <span style={{ height: CELL_HEIGHT }} key={d.toString()} className="rs__cell">
              <Cell
                start={dayjs(start).toDate()}
                end={dayjs(end).toDate()}
                day={selectedDate}
                height={CELL_HEIGHT}
                resourceKey={field}
                resourceVal={resource ? resource[field] : null}
                cellRenderer={cellRenderer}
              />
              <Fragment>
                {typeof headRenderer === 'function' ? (
                  <div style={{ position: 'absolute', top: 0 }}>{headRenderer(today)}</div>
                ) : (
                  <Avatar
                    style={{
                      width: 27,
                      height: 27,
                      position: 'absolute',
                      top: 0,
                      background: isToday ? theme.palette.secondary.main : 'transparent',
                      color: isToday ? theme.palette.secondary.contrastText : '',
                      marginBottom: 2,
                    }}
                  >
                    <Typography
                      color={!todayDayjs.isSame(monthStart, 'month') ? '#ccc' : 'textPrimary'}
                      className={!disableGoToDay ? 'rs__hover__op' : ''}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disableGoToDay) {
                          handleGotoDay(today);
                        }
                      }}
                    >
                      {todayDayjs.format('DD')}
                    </Typography>
                  </Avatar>
                )}

                <MonthEvents
                  events={todayEvents}
                  resourceId={resource?.[field]}
                  today={today}
                  eachWeekStart={eachWeekStart}
                  eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                  daysList={daysList}
                  onViewMore={(e) => {
                    if (typeof onClickMore === 'function') {
                      onClickMore(e, handleGotoDay);
                    } else {
                      handleGotoDay(e);
                    }
                  }}
                  cellHeight={CELL_HEIGHT}
                />
              </Fragment>
            </span>
          );
        });

        rows.push(<Fragment key={startDay.toString()}>{cells}</Fragment>);
      }
      return rows;
    },
    [
      CELL_HEIGHT,
      cellRenderer,
      daysList,
      disableGoToDay,
      eachWeekStart,
      endHour,
      events,
      fields,
      hFormat,
      handleGotoDay,
      headRenderer,
      monthStart,
      onClickMore,
      resourceFields,
      selectedDate,
      startHour,
      theme.palette.secondary.contrastText,
      theme.palette.secondary.main,
      timeZone,
      weekDays,
    ]
  );

  return (
    <>
      <TableGrid
        days={daysList.length}
        ref={headersRef}
        indent="0"
        sticky="1"
        stickyNavigation={stickyNavigation}
      >
        {daysList.map((date, i) => (
          <Typography
            key={i}
            className="rs__cell rs__header rs__header__center"
            align="center"
            variant="body2"
          >
            {dayjs(date).format('ddd')}
          </Typography>
        ))}
      </TableGrid>

      <TableGrid days={daysList.length} ref={bodyRef} indent="0">
        {renderCells(resource)}
      </TableGrid>
    </>
  );
};

export default MonthTable;
