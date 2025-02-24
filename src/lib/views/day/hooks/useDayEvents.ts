import { useCallback, useEffect } from 'react';
import { ProcessedEvent } from '@/lib';
import useStore from '@/lib/hooks/useStore.ts';
import { dayjs } from '@/config/dayjs.ts';

export const useDayEvents = (startTime: Date, endTime: Date): ProcessedEvent[] => {
  const { events, getRemoteEvents, triggerLoading, handleState } = useStore();

  const fetchEvents = useCallback(async () => {
    if (!getRemoteEvents) return;

    try {
      triggerLoading(true);

      const dayStart = dayjs(startTime).subtract(1, 'day');
      const dayEnd = dayjs(endTime).add(1, 'day');

      const fetchedEvents = await getRemoteEvents({
        start: dayStart.toDate(),
        end: dayEnd.toDate(),
        view: 'day',
      });

      if (Array.isArray(fetchedEvents) && fetchedEvents.length > 0) {
        handleState(fetchedEvents, 'events');
      }
    } catch (error) {
      console.error('Error fetching day events:', error);
    } finally {
      triggerLoading(false);
    }
  }, [getRemoteEvents, triggerLoading, startTime, endTime, handleState]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return events;
};
