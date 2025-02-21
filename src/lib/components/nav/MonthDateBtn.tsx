import { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { Button, Popover } from '@mui/material';
import { LocaleArrow } from '../common/LocaleArrow';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';

interface MonthDateBtnProps {
  selectedDate: Date;
  onChange(value: Date): void;
}

const MonthDateBtn = ({ selectedDate, onChange }: MonthDateBtnProps) => {
  const { navigationPickerProps } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const selectedDayjs = dayjs(selectedDate);
  const currentMonth = selectedDayjs.month();

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
    const newDate = selectedDayjs.month(currentMonth - 1);
    onChange(newDate.toDate());
  };

  const handleNext = () => {
    const newDate = selectedDayjs.month(currentMonth + 1);
    onChange(newDate.toDate());
  };

  return (
    <>
      <LocaleArrow type="prev" onClick={handlePrev} aria-label="previous month" />
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
          openTo="month"
          views={['year', 'month']}
          value={selectedDayjs}
          onChange={handleChange}
        />
      </Popover>
      <LocaleArrow type="next" onClick={handleNext} aria-label="next month" />
    </>
  );
};

export { MonthDateBtn };
