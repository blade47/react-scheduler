import { Typography } from '@mui/material';
import { isTimeZonedToday } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';
import { MouseEvent } from 'react';

interface TodayTypoProps {
  date: Date;
  onClick?(day: Date): void;
}

interface TypographyStyles {
  fontWeight: 'bold' | 'inherit';
  fontSize?: number;
}

const TodayTypo = ({ date, onClick }: TodayTypoProps) => {
  const { timeZone } = useStore();
  const isToday = isTimeZonedToday({ dateLeft: date, timeZone });
  const dateDayjs = dayjs(date);

  const getTypographyStyles = (isSmall: boolean = false): TypographyStyles => ({
    fontWeight: isToday ? 'bold' : 'inherit',
    ...(isSmall && { fontSize: 11 }),
  });

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    onClick?.(date);
  };

  return (
    <div>
      <Typography
        style={getTypographyStyles()}
        color={isToday ? 'primary' : 'inherit'}
        className={onClick ? 'rs__hover__op' : ''}
        onClick={onClick ? handleClick : undefined}
      >
        {dateDayjs.format('DD')}
      </Typography>

      <Typography color={isToday ? 'primary' : 'inherit'} style={getTypographyStyles(true)}>
        {dateDayjs.format('ddd')}
      </Typography>
    </div>
  );
};

export default TodayTypo;
