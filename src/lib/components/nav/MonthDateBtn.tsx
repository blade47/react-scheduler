import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { Button, Popover } from '@mui/material';
import { LocaleArrow } from '../common/LocaleArrow';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';
import { getNewDate, isDateInRange } from '@/lib/helpers/generals.tsx';

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { navigationPickerProps, minDate, maxDate } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const selectedDayjs = dayjs(selectedDate);

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
    const newDate = getNewDate(selectedDayjs, direction, 'month');
    if (isDateInRange(newDate, minDate, maxDate)) {
      onChange(newDate.toDate());
    }
  };

  const canGo = (direction: 'prev' | 'next') => {
    const newDate = getNewDate(selectedDayjs, direction, 'month');
    return isDateInRange(newDate, minDate, maxDate);
  };

  const handlePrev = () => handleDateNavigation('prev');
  const handleNext = () => handleDateNavigation('next');

  return (
    <>
      <LocaleArrow
        type="prev"
        onClick={handlePrev}
        aria-label="previous month"
        disabled={!canGo('prev')}
      />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected month">
        {selectedDayjs.format('MMMM YYYY')}
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
          openTo="month"
          views={['year', 'month']}
          value={selectedDayjs}
          onChange={handleChange}
        />
      </Popover>
      <LocaleArrow
        type="next"
        onClick={handleNext}
        aria-label="next month"
        disabled={!canGo('next')}
      />
    </>
  );
};

export { MonthDateBtn };
