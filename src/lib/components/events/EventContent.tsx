import { Typography } from '@mui/material';
import { dayjs } from '@/config/dayjs';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import { EventContentProps } from '@/lib/types.ts';
import useStore from '@/lib/hooks/useStore.ts';
import { EventContent, MultidayContent } from '@/lib/theme/css.ts';

export const EventContentComponent = ({
  event,
  showTime,
  hideDates,
  hFormat,
  multiday,
  hasPrev,
  hasNext,
}: EventContentProps) => {
  const { direction } = useStore();
  const NextArrow = direction === 'rtl' ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === 'rtl' ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;

  const durationInMinutes = dayjs(event.end).diff(dayjs(event.start), 'minute');
  const isShortEvent = durationInMinutes <= 15;

  if (multiday) {
    return (
      <MultidayContent>
        <div className="multiday-arrow">
          {hasPrev && (
            <PrevArrow
              fontSize="small"
              sx={{
                fontSize: '1.1rem',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          )}
        </div>

        <div className="multiday-title">
          {!hasPrev && showTime && !hideDates && (
            <Typography className="multiday-time" component="span">
              {dayjs(event.start).format(hFormat)}
            </Typography>
          )}

          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {event.title}
          </Typography>

          {event.subtitle && (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.75rem',
                opacity: 0.8,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {event.subtitle}
            </Typography>
          )}
        </div>

        <div className="multiday-arrow">
          {hasNext && (
            <NextArrow
              fontSize="small"
              sx={{
                fontSize: '1.2rem',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          )}
          {!hasNext && showTime && !hideDates && (
            <Typography className="multiday-time" component="span">
              {dayjs(event.end).format(hFormat)}
            </Typography>
          )}
        </div>
      </MultidayContent>
    );
  }

  return (
    <EventContent>
      {isShortEvent ? (
        <Typography
          variant="subtitle2"
          style={{
            fontSize: 11,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {dayjs(event.start).format('HH:mm')} • {event.title}
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
            {event.title}
          </Typography>
          {event.subtitle && (
            <Typography variant="body2" style={{ fontSize: 11 }} noWrap>
              {event.subtitle}
            </Typography>
          )}
          {showTime && (
            <Typography style={{ fontSize: 11 }} noWrap>
              {`${dayjs(event.start).format(hFormat)} - ${dayjs(event.end).format(hFormat)}`}
            </Typography>
          )}
        </>
      )}
    </EventContent>
  );
};
