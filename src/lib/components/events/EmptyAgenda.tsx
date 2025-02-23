import { memo } from 'react';
import { Typography } from '@mui/material';
import useStore from '../../hooks/useStore';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { EmptyContainer, EmptyContent } from '@/lib/theme/css.ts';
import { EmptyAgendaProps } from '@/lib/types.ts';

export const EmptyAgenda = memo(({ customMessage }: EmptyAgendaProps) => {
  const { height, translations } = useStore();

  return (
    <EmptyContainer
      sx={{
        height: height / 2,
      }}
      className="rs__empty_agenda"
    >
      <EmptyContent className="rs__cell rs__agenda_items">
        <CalendarTodayOutlinedIcon className="rs__empty_icon" fontSize="large" />
        <Typography variant="body1" color="textSecondary">
          {customMessage || translations.noDataToDisplay}
        </Typography>
      </EmptyContent>
    </EmptyContainer>
  );
});

EmptyAgenda.displayName = 'EmptyAgenda';

export default EmptyAgenda;
