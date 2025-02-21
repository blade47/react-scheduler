import { useState } from 'react';
import { Button, Popover } from '@mui/material';
import { WeekProps } from '../../views/Week';
import { LocaleArrow } from '../common/LocaleArrow';
import { DateCalendar } from '@mui/x-date-pickers';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';

interface WeekDateBtnProps {
  selectedDate: Date;
  onChange(value: Date): void;
  weekProps: WeekProps;
}

const WeekDateBtn = ({ selectedDate, onChange, weekProps }: WeekDateBtnProps) => {
  const { navigationPickerProps } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { weekStartOn } = weekProps;

  const selectedDayjs = dayjs(selectedDate);
  const weekStart = selectedDayjs.startOf('week').add(weekStartOn, 'day');
  const weekEnd = selectedDayjs.endOf('week').add(weekStartOn, 'day');

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

  const handlePrev = () => {
    const lastDayPrevWeek = weekStart.subtract(1, 'day');
    onChange(lastDayPrevWeek.toDate());
  };

  const handleNext = () => {
    const firstDayNextWeek = weekEnd.add(1, 'day');
    onChange(firstDayNextWeek.toDate());
  };

  return (
    <>
      <LocaleArrow type="prev" onClick={handlePrev} aria-label="previous week" />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected week">
        {`${weekStart.format('DD')} - ${weekEnd.format('DD MMM YYYY')}`}
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
          openTo="day"
          views={['month', 'day']}
          value={selectedDayjs}
          onChange={handleChange}
        />
      </Popover>
      <LocaleArrow type="next" onClick={handleNext} aria-label="next week" />
    </>
  );
};

export { WeekDateBtn };
