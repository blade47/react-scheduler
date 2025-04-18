import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { Button, Popover } from '@mui/material';
import { LocaleArrow } from '../common/LocaleArrow.tsx';
import useStore from '../../hooks/useStore.ts';
import { dayjs } from '@/config/dayjs.ts';
import { getNewDate, isDateInRange } from '@/helpers/generals.tsx';

interface Props {
  selectedDate: Date;
  onChange(value: Date): void;
}

const DayDateBtn = ({ selectedDate, onChange }: Props) => {
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
    const newDate = getNewDate(selectedDate, direction);
    if (isDateInRange(newDate, minDate, maxDate)) {
      onChange(newDate);
    }
  };

  const canGo = (direction: 'prev' | 'next') => {
    const newDate = getNewDate(selectedDate, direction);
    return isDateInRange(newDate, minDate, maxDate);
  };

  const handlePrev = () => handleDateNavigation('prev');
  const handleNext = () => handleDateNavigation('next');

  return (
    <>
      <LocaleArrow
        type="prev"
        onClick={handlePrev}
        aria-label="previous day"
        disabled={!canGo('prev')}
      />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected date">
        {selectedDayjs.format('LL')}
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
          value={selectedDayjs}
          onChange={handleChange}
        />
      </Popover>
      <LocaleArrow
        type="next"
        onClick={handleNext}
        aria-label="next day"
        disabled={!canGo('next')}
      />
    </>
  );
};

export { DayDateBtn };
