import type { KeyboardEvent, PointerEvent } from 'react';

import { useRef } from 'react';
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

const eventContainer = (target: HTMLElement): HTMLElement | null =>
  target.closest<HTMLElement>('.rs__event__item');

const useEventResize = (event: ProcessedEvent, enabled: boolean) => {
  const { view, day, week, onEventResize, confirmEvent, triggerLoading } = useStore();
  const session = useRef<ResizeSession | null>(null);
  const stepMinutes = view === 'day' ? (day?.step ?? 60) : (week?.step ?? 60);
  const endHour = view === 'day' ? (day?.endHour ?? 24) : (week?.endHour ?? 24);
  const maxEnd = dayjs(event.start).hour(endHour).minute(0).second(0).millisecond(0).toDate();

  const commit = async (nextEnd: Date): Promise<void> => {
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
  };

  if (!enabled) return { resizeHandleProps: undefined };

  const finish = (target: HTMLElement, pointerId: number): void => {
    const active = session.current;
    if (!active || active.pointerId !== pointerId) return;
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
    active.container.style.height = `${active.originalHeight}px`;
    session.current = null;
    void commit(active.nextEnd);
  };

  return {
    resizeHandleProps: {
      role: 'separator' as const,
      'aria-label': `Resize ${String(event.title)}`,
      'aria-orientation': 'horizontal' as const,
      tabIndex: 0,
      onPointerDown: (pointerEvent: PointerEvent<HTMLElement>) => {
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
      onPointerMove: (pointerEvent: PointerEvent<HTMLElement>) => {
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
        const originalMinutes = Math.max(
          stepMinutes,
          dayjs(event.end).diff(event.start, 'minute')
        );
        const nextMinutes = dayjs(active.nextEnd).diff(event.start, 'minute');
        active.container.style.height = `${active.originalHeight * (nextMinutes / originalMinutes)}px`;
      },
      onPointerUp: (pointerEvent: PointerEvent<HTMLElement>) => {
        pointerEvent.preventDefault();
        pointerEvent.stopPropagation();
        finish(pointerEvent.currentTarget, pointerEvent.pointerId);
      },
      onPointerCancel: () => {
        const active = session.current;
        if (active) active.container.style.height = `${active.originalHeight}px`;
        session.current = null;
      },
      onKeyDown: (keyboardEvent: KeyboardEvent<HTMLElement>) => {
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
    },
  };
};

export default useEventResize;
