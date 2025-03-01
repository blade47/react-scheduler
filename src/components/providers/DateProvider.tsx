import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dayjs } from '@/config/dayjs.ts';

interface Props {
  children: React.ReactNode;
  locale: string;
}

const DateProvider = ({ children, locale }: Props) => {
  dayjs.locale(locale);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
