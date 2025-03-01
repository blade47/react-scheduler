import { ProcessedEvent } from '@/index.tsx';
import useStore from '@/hooks/useStore.ts';
import { useCallback, useEffect } from 'react';
import { dayjs } from '@/config/dayjs.ts';

export const useMonthEvents = (weeks: Date[], days: Date[]): ProcessedEvent[] => {
  const { events, getRemoteEvents, triggerLoading, handleState } = useStore();

  const fetchEvents = useCallback(async () => {
    if (!getRemoteEvents) return;

    try {
      triggerLoading(true);

      const monthStart = dayjs(weeks[0]);
      const monthEnd = dayjs(weeks[weeks.length - 1]).add(days.length, 'day');

      const fetchedEvents = await getRemoteEvents({
        start: monthStart.toDate(),
        end: monthEnd.toDate(),
        view: 'month',
      });

      if (Array.isArray(fetchedEvents)) {
        handleState(fetchedEvents, 'events');
      }
    } catch (error) {
      console.error('Error fetching month events:', error);
    } finally {
      triggerLoading(false);
    }
  }, [getRemoteEvents, triggerLoading, weeks, days.length, handleState]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return events;
};
