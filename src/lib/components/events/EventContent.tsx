import { Typography } from '@mui/material';
import { dayjs } from '@/config/dayjs';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import { ProcessedEvent, View } from '@/lib/types.ts';
import useStore from '@/lib/hooks/useStore.ts';
import { EventContent, MultidayContent } from '@/lib/theme/css.ts';

export interface Props {
  event: ProcessedEvent;
  showTime: boolean;
  hFormat: string;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  view: View;
}

export const EventContentComponent = ({
  event,
  showTime,
  hFormat,
  multiday,
  hasPrev,
  hasNext,
  view,
}: Props) => {
  const { direction } = useStore();
  const NextArrow = direction === 'rtl' ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === 'rtl' ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const durationInMinutes = dayjs(event.end).diff(dayjs(event.start), 'minute');
  const isShortDuration = durationInMinutes <= 30;

  if (multiday) {
    return (
      <MultidayContent>
        <div className="multiday-arrow">{hasPrev && <PrevArrow fontSize="small" />}</div>
        <div className="multiday-title">
          <Typography className="event-title" noWrap>
            {event.title}
          </Typography>
        </div>
        <div className="multiday-arrow">{hasNext && <NextArrow fontSize="small" />}</div>
      </MultidayContent>
    );
  }

  // Month view - compact display
  if (view === 'month') {
    return (
      <EventContent view="month">
        <Typography className="event-title" noWrap>
          {event.title}
        </Typography>
      </EventContent>
    );
  }

  // Day/Week view
  if (isShortDuration) {
    return (
      <EventContent view={view}>
        <Typography className="event-title" noWrap>
          {event.title}
        </Typography>
      </EventContent>
    );
  }

  return (
    <EventContent view={view}>
      <Typography className="event-title" noWrap>
        {event.title}
      </Typography>
      {event.subtitle && (
        <Typography className="event-subtitle" noWrap>
          {event.subtitle}
        </Typography>
      )}
      {showTime && (
        <Typography className="event-time" noWrap>
          {`${dayjs(event.start).format(hFormat)} - ${dayjs(event.end).format(hFormat)}`}
        </Typography>
      )}
    </EventContent>
  );
};
