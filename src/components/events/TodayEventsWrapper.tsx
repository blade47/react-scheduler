import React, { memo } from 'react';
import { styled } from '@mui/material/styles';
import { ProcessedEvent } from '@/index.tsx';
import EventItem from '@/components/events/EventItem.tsx';

interface Props {
  event: ProcessedEvent;
  style: React.CSSProperties;
}

const EventContainer = styled('div')({
  position: 'absolute',
  width: '100%',
  display: 'flex',
  alignItems: 'stretch',
});

export const TodayEventsWrapper = memo(({ event, style }: Props) => {
  return (
    <EventContainer className="rs__event__item" style={style}>
      <EventItem event={event} />
    </EventContainer>
  );
});

TodayEventsWrapper.displayName = 'TodayEventsWrapper';
