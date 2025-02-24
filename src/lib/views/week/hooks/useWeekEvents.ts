import { useCallback, useEffect } from 'react';
import useStore from '../../../hooks/useStore';
import { ProcessedEvent } from '@/lib';
import { dayjs } from '@/config/dayjs.ts';

export const useWeekEvents = (selectedDate: Date, days: Date[]): ProcessedEvent[] => {
  const { events, getRemoteEvents, triggerLoading, handleState, week } = useStore();

  const { weekStartOn } = week!;

  const weekStart = dayjs(selectedDate).startOf('week').add(weekStartOn, 'day').toDate();
  const weekEnd = dayjs(days[days.length - 1])
    .endOf('day')
    .toDate();

  const fetchEvents = useCallback(async () => {
    if (!getRemoteEvents) return;

    try {
      triggerLoading(true);

      const fetchedEvents = await getRemoteEvents({
        start: weekStart,
        end: weekEnd,
        view: 'week',
      });

      if (Array.isArray(fetchedEvents)) {
        handleState(fetchedEvents, 'events');
      }
    } catch (error) {
      console.error('Error fetching week events:', error);
    } finally {
      triggerLoading(false);
    }
  }, [getRemoteEvents, triggerLoading, weekStart, weekEnd, handleState]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return events;
};
