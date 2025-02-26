import React, { useState } from 'react';
import { Button, Popover } from '@mui/material';
import { LocaleArrow } from '../common/LocaleArrow';
import { DateCalendar } from '@mui/x-date-pickers';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';
import { getNewDate, getWeekBoundaries, isDateInRange } from '@/lib/helpers/generals.tsx';
import { WeekProps } from '@/lib/types.ts';

interface Props {
  selectedDate: Date;
  onChange(value: Date): void;
  weekProps: WeekProps;
}

const WeekDateBtn = ({ selectedDate, onChange, weekProps }: Props) => {
  const { navigationPickerProps, minDate, maxDate } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { weekDays } = weekProps;

  const { weekStart, weekStartOn } = getWeekBoundaries(selectedDate, weekDays, minDate, maxDate);

  const weekEnd = dayjs(weekStart).endOf('week').add(weekStartOn, 'day');

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (date: Date | null) => {
    onChange(date || new Date());
    handleClose();
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = getNewDate(selectedDate, direction, 'week');
    if (isDateInRange(newDate, minDate, maxDate)) {
      onChange(newDate);
    }
  };

  const canGo = (direction: 'prev' | 'next') => {
    const newDate = getNewDate(selectedDate, direction, 'week');
    return isDateInRange(newDate, minDate, maxDate);
  };

  const handlePrev = () => handleDateNavigation('prev');
  const handleNext = () => handleDateNavigation('next');

  return (
    <>
      <LocaleArrow
        type="prev"
        onClick={handlePrev}
        aria-label="previous week"
        disabled={!canGo('prev')}
      />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected week">
        {`${dayjs(weekStart).format('DD')} - ${weekEnd.format('DD MMM YYYY')}`}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <DateCalendar
          {...navigationPickerProps}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          openTo="day"
          views={['month', 'day']}
          value={dayjs(weekStart)}
          onChange={handleChange}
        />
      </Popover>
      <LocaleArrow
        type="next"
        onClick={handleNext}
        aria-label="next week"
        disabled={!canGo('next')}
      />
    </>
  );
};

export { WeekDateBtn };
