import { memo, useCallback } from 'react';
import { MouseEvent } from 'react';
import { isTimeZonedToday } from '../../helpers/generals';
import useStore from '../../hooks/useStore';
import { dayjs } from '@/config/dayjs';
import { DateContainer, DateNumber, DateWeekday } from '@/lib/theme/css.ts';

export interface Props {
  date: Date;
  onClick?(day: Date): void;
}

const TodayTypo = memo(({ date, onClick }: Props) => {
  const { timeZone } = useStore();
  const isToday = isTimeZonedToday({ dateLeft: date, timeZone });
  const dateDayjs = dayjs(date);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick?.(date);
    },
    [date, onClick]
  );

  return (
    <DateContainer
      className={`${isToday ? 'today' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <DateNumber isToday={isToday} isClickable={!!onClick} component="span">
        {dateDayjs.format('DD')}
      </DateNumber>

      <DateWeekday isToday={isToday} component="span" variant="caption">
        {dateDayjs.format('ddd')}
      </DateWeekday>
    </DateContainer>
  );
});

TodayTypo.displayName = 'TodayTypo';

export default TodayTypo;
