import type { KeyboardEvent, PointerEvent } from 'react';

import { useCallback, useMemo, useRef } from 'react';
import dayjs from 'dayjs';

import type { ProcessedEvent } from '@/types.ts';

import { calculateResizedEnd, shiftResizedEnd } from '@/helpers/eventResize.ts';

import useStore from './useStore.ts';

interface ResizeSession {
  pointerId: number;
  originClientY: number;
  originalHeight: number;
  nextEnd: Date;
  container: HTMLElement;
}

export interface ResizeHandleProps {
  role: 'separator';
  'aria-label': string;
  'aria-orientation': 'horizontal';
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuenow': number;
  tabIndex: number;
  onPointerDown: (pointerEvent: PointerEvent<HTMLElement>) => void;
  onPointerMove: (pointerEvent: PointerEvent<HTMLElement>) => void;
  onPointerUp: (pointerEvent: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (pointerEvent: PointerEvent<HTMLElement>) => void;
  onKeyDown: (keyboardEvent: KeyboardEvent<HTMLElement>) => void;
}

const eventContainer = (target: HTMLElement): HTMLElement | null =>
  target.closest<HTMLElement>('.rs__event__item');

/** Minutes elapsed from `start` to `date` (duration semantics for the ARIA `aria-value*` triad).
 *  Using minutes-of-day collapses `valuemax` below `valuemin` at the midnight/24h boundary. */
const minutesFromStart = (start: Date, date: Date): number => dayjs(date).diff(start, 'minute');

const useEventResize = (event: ProcessedEvent, enabled: boolean) => {
  const { view, day, week, onEventResize, confirmEvent, triggerLoading } = useStore();
  const session = useRef<ResizeSession | null>(null);
  const stepMinutes = view === 'day' ? (day?.step ?? 60) : (week?.step ?? 60);
  const endHour = view === 'day' ? (day?.endHour ?? 24) : (week?.endHour ?? 24);

  const maxEnd = useMemo(
    () => dayjs(event.start).hour(endHour).minute(0).second(0).millisecond(0).toDate(),
    [event.start, endHour]
  );
  const minEnd = useMemo(
    () => dayjs(event.start).add(stepMinutes, 'minute').toDate(),
    [event.start, stepMinutes]
  );

  const commit = useCallback(
    async (nextEnd: Date): Promise<void> => {
      if (nextEnd.valueOf() === event.end.valueOf()) return;
      const updatedEvent: ProcessedEvent = { ...event, end: nextEnd };
      if (!onEventResize) {
        confirmEvent(updatedEvent, 'edit');
        return;
      }
      try {
        triggerLoading(true);
        const accepted = await onEventResize(updatedEvent, event);
        if (accepted) confirmEvent(accepted, 'edit');
      } catch {
        return;
      } finally {
        triggerLoading(false);
      }
    },
    [event, onEventResize, confirmEvent, triggerLoading]
  );

  const finish = useCallback(
    (target: HTMLElement, pointerId: number): void => {
      const active = session.current;
      if (!active || active.pointerId !== pointerId) return;
      if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
      active.container.style.height = `${active.originalHeight}px`;
      target.setAttribute('aria-valuenow', String(minutesFromStart(event.start, event.end)));
      session.current = null;
      void commit(active.nextEnd);
    },
    [commit, event.start, event.end]
  );

  const onPointerDown = useCallback(
    (pointerEvent: PointerEvent<HTMLElement>) => {
      const container = eventContainer(pointerEvent.currentTarget);
      if (!container) return;
      pointerEvent.preventDefault();
      pointerEvent.stopPropagation();
      pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
      session.current = {
        pointerId: pointerEvent.pointerId,
        originClientY: pointerEvent.clientY,
        originalHeight: container.getBoundingClientRect().height,
        nextEnd: event.end,
        container,
      };
    },
    [event.end]
  );

  const onPointerMove = useCallback(
    (pointerEvent: PointerEvent<HTMLElement>) => {
      const active = session.current;
      if (!active || active.pointerId !== pointerEvent.pointerId) return;
      pointerEvent.preventDefault();
      active.nextEnd = calculateResizedEnd({
        start: event.start,
        originalEnd: event.end,
        maxEnd,
        originClientY: active.originClientY,
        currentClientY: pointerEvent.clientY,
        renderedHeight: active.originalHeight,
        stepMinutes,
      });
      const originalMinutes = Math.max(stepMinutes, dayjs(event.end).diff(event.start, 'minute'));
      const nextMinutes = dayjs(active.nextEnd).diff(event.start, 'minute');
      active.container.style.height = `${active.originalHeight * (nextMinutes / originalMinutes)}px`;
      // Keep the separator's live value in sync during the drag without forcing a re-render.
      pointerEvent.currentTarget.setAttribute(
        'aria-valuenow',
        String(minutesFromStart(event.start, active.nextEnd))
      );
    },
    [event.start, event.end, maxEnd, stepMinutes]
  );

  const onPointerUp = useCallback(
    (pointerEvent: PointerEvent<HTMLElement>) => {
      pointerEvent.preventDefault();
      pointerEvent.stopPropagation();
      finish(pointerEvent.currentTarget, pointerEvent.pointerId);
    },
    [finish]
  );

  const onPointerCancel = useCallback(
    (pointerEvent: PointerEvent<HTMLElement>) => {
      const active = session.current;
      if (active) {
        active.container.style.height = `${active.originalHeight}px`;
        pointerEvent.currentTarget.setAttribute(
          'aria-valuenow',
          String(minutesFromStart(event.start, event.end))
        );
      }
      session.current = null;
    },
    [event.start, event.end]
  );

  const onKeyDown = useCallback(
    (keyboardEvent: KeyboardEvent<HTMLElement>) => {
      if (keyboardEvent.key !== 'ArrowUp' && keyboardEvent.key !== 'ArrowDown') return;
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      const nextEnd = shiftResizedEnd({
        start: event.start,
        currentEnd: event.end,
        maxEnd,
        stepMinutes,
        direction: keyboardEvent.key === 'ArrowDown' ? 1 : -1,
      });
      void commit(nextEnd);
    },
    [event.start, event.end, maxEnd, stepMinutes, commit]
  );

  const resizeHandleProps = useMemo<ResizeHandleProps | undefined>(() => {
    if (!enabled) return undefined;
    return {
      role: 'separator',
      'aria-label': `Resize ${String(event.title)}`,
      'aria-orientation': 'horizontal',
      'aria-valuemin': minutesFromStart(event.start, minEnd),
      'aria-valuemax': minutesFromStart(event.start, maxEnd),
      'aria-valuenow': minutesFromStart(event.start, event.end),
      tabIndex: 0,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onKeyDown,
    };
  }, [
    enabled,
    event.title,
    event.start,
    event.end,
    minEnd,
    maxEnd,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  ]);

  return { resizeHandleProps };
};

export default useEventResize;
