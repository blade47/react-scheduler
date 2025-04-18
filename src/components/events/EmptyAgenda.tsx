import { memo } from 'react';
import { Typography } from '@mui/material';
import useStore from '../../hooks/useStore.ts';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { EmptyContainer, EmptyContent } from '@/theme/css.ts';

export interface Props {
  customMessage?: string;
}

export const EmptyAgenda = memo(({ customMessage }: Props) => {
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
