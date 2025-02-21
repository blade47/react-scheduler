import { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { Button, Popover } from '@mui/material';
import { LocaleArrow } from '../common/LocaleArrow';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';

interface DayDateBtnProps {
  selectedDate: Date;
  onChange(value: Date): void;
}

const DayDateBtn = ({ selectedDate, onChange }: DayDateBtnProps) => {
  const { navigationPickerProps } = useStore();
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

  const handlePrev = () => {
    const prevDay = selectedDayjs.subtract(1, 'day');
    onChange(prevDay.toDate());
  };

  const handleNext = () => {
    const nextDay = selectedDayjs.add(1, 'day');
    onChange(nextDay.toDate());
  };

  return (
    <>
      <LocaleArrow type="prev" onClick={handlePrev} aria-label="previous day" />
      <Button style={{ padding: 4 }} onClick={handleOpen} aria-label="selected date">
        {selectedDayjs.format('DD MMMM YYYY')}
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
      <LocaleArrow type="next" onClick={handleNext} aria-label="next day" />
    </>
  );
};

export { DayDateBtn };
