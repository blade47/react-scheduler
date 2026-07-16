import React, { DragEvent, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { DefaultResource, EventActions, ProcessedEvent } from '@/index.tsx';
import { defaultProps } from './default.ts';
import { StoreContext } from './context.ts';
import { Store, SelectedRange } from './types.ts';
import {
  hasControlledDateChanged,
  resolveControlledDate,
  resolveControlledWeekStartOn,
} from './controlledPropsSync.ts';
import { arraytizeFieldVal, getAvailableViews, getTimeZonedDate } from '../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';
import { Scheduler, SchedulerStateBase, View } from '@/types.ts';

interface Props {
  children: React.ReactNode;
  initial: Scheduler;
}

export const StoreProvider: React.FC<Props> = ({ children, initial }) => {
  const [state, setState] = useState<SchedulerStateBase>(() => {
    const defaults = defaultProps(initial);
    return {
      ...defaults,
      dialog: false,
      selectedRange: undefined,
      selectedEvent: undefined,
      currentDragged: undefined,
    } as SchedulerStateBase;
  });

  useEffect(() => {
    setState((previous) => ({
      ...previous,
      events: initial.events ?? [],
      resources: initial.resources ?? [],
      onEventDrop: initial.onEventDrop,
      onEventResize: initial.onEventResize,
      onCellClick: initial.onCellClick,
      editable: initial.editable ?? previous.editable,
      draggable: initial.draggable ?? previous.draggable,
      resizable: initial.resizable ?? previous.resizable,
      customDialog: initial.customDialog,
      minDate: resolveControlledDate(initial.minDate, previous.minDate),
      maxDate: resolveControlledDate(initial.maxDate, previous.maxDate),
      week: resolveControlledWeekStartOn(initial.week?.weekStartOn, previous.week),
    }));
  }, [
    initial.customDialog,
    initial.editable,
    initial.events,
    initial.draggable,
    initial.maxDate,
    initial.minDate,
    initial.onCellClick,
    initial.onEventDrop,
    initial.onEventResize,
    initial.resizable,
    initial.resources,
    initial.week,
  ]);

  // selectedDate is also mutated internally (handleGotoDay, view navigation), so — unlike the
  // fields above — the store's current value cannot be used to detect whether the *prop* changed.
  // Track the last prop value we synced in a ref and only push updates when it genuinely moves,
  // so this effect never fights in-progress navigation on unrelated renders (e.g. a consumer
  // re-rendering with a new-but-equal `Date` instance).
  const lastSyncedSelectedDateRef = useRef<number | undefined>(initial.selectedDate?.getTime());

  useEffect(() => {
    const nextSelectedDate = initial.selectedDate;

    if (!hasControlledDateChanged(nextSelectedDate, lastSyncedSelectedDateRef.current)) {
      return;
    }

    lastSyncedSelectedDateRef.current = nextSelectedDate?.getTime();

    if (nextSelectedDate === undefined) return;

    setState((previous) => ({
      ...previous,
      selectedDate: getTimeZonedDate(nextSelectedDate, initial.timeZone),
    }));
  }, [initial.selectedDate, initial.timeZone]);

  const handleState = (
    value: SchedulerStateBase[keyof SchedulerStateBase],
    name: keyof SchedulerStateBase
  ): void => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const getViews = useCallback((): View[] => {
    return getAvailableViews(state);
  }, [state]);

  const toggleAgenda = useCallback((): void => {
    setState((prev) => {
      const newStatus = !prev.agenda;

      if (state.onViewChange && typeof state.onViewChange === 'function') {
        state.onViewChange(state.view, newStatus);
      }

      return { ...prev, agenda: newStatus };
    });
  }, [state]);

  const triggerDialog = useCallback(
    (status: boolean, selected?: SelectedRange | ProcessedEvent): void => {
      const isEvent = (value: unknown): value is ProcessedEvent =>
        typeof value === 'object' && value !== null && 'event_id' in value;

      const isRecord = (value: unknown): value is Record<string, unknown> =>
        typeof value === 'object' && value !== null;

      setState((prev) => {
        const processedEvent = isEvent(selected) ? selected : undefined;
        const resourceField = state.resourceFields?.idField;

        const selectedValue: unknown = selected;
        const selectedRecord = isRecord(selectedValue) ? selectedValue : undefined;
        const selectedRangeResource = resourceField ? selectedRecord?.[resourceField] : undefined;
        const rangeResource =
          typeof selectedRangeResource === 'string' || typeof selectedRangeResource === 'number'
            ? selectedRangeResource
            : undefined;
        const eventResource =
          processedEvent && resourceField
            ? (processedEvent[resourceField] as DefaultResource['assignee'])
            : undefined;

        return {
          ...prev,
          dialog: status,
          selectedRange: !processedEvent
            ? (selected as SelectedRange) || {
                start: new Date(),
                end: new Date(Date.now() + 60 * 60 * 1000),
              }
            : undefined,
          selectedEvent: processedEvent,
          selectedResource: rangeResource ?? eventResource ?? prev.selectedResource,
        };
      });
    },
    [state.resourceFields?.idField]
  );

  const triggerLoading = useCallback(
    (status: boolean): void => {
      if (typeof initial.loading === 'undefined') {
        setState((prev) => ({ ...prev, loading: status }));
      }
    },
    [initial.loading]
  );

  const handleGotoDay = useCallback(
    (day: Date): void => {
      const currentViews = getViews();
      let view: View | undefined;

      if (currentViews.includes('day')) {
        view = 'day';
      } else if (currentViews.includes('week')) {
        view = 'week';
      } else {
        console.warn('No Day/Week views available');
        return;
      }

      setState((prev) => ({ ...prev, view, selectedDate: day }));

      if (view && state.onViewChange && typeof state.onViewChange === 'function') {
        state.onViewChange(view, state.agenda);
      }

      if (view && state.onSelectedDateChange && typeof state.onSelectedDateChange === 'function') {
        state.onSelectedDateChange(day);
      }
    },
    [getViews, state]
  );

  const confirmEvent = (event: ProcessedEvent | ProcessedEvent[], action: EventActions): void => {
    setState((prev) => {
      let updatedEvents: ProcessedEvent[];

      if (action === 'edit') {
        if (Array.isArray(event)) {
          updatedEvents = prev.events.map((e) => {
            const exist = event.find((ex) => ex.event_id === e.event_id);
            return exist ? { ...e, ...exist } : e;
          });
        } else {
          updatedEvents = prev.events.map((e) =>
            e.event_id === event.event_id ? { ...e, ...event } : e
          );
        }
      } else {
        updatedEvents = [...prev.events, ...(Array.isArray(event) ? event : [event])];
      }

      return { ...prev, events: updatedEvents };
    });
  };

  const setCurrentDragged = (event?: ProcessedEvent): void => {
    setState((prev) => ({ ...prev, currentDragged: event }));
  };

  const onDrop = useCallback(
    async (
      event: DragEvent<HTMLButtonElement>,
      eventId: string,
      startTime: Date,
      resKey?: string,
      resVal?: string | number
    ): Promise<void> => {
      const droppedEvent = state.events.find((e) =>
        typeof e.event_id === 'number' ? e.event_id === +eventId : e.event_id === eventId
      );

      if (!droppedEvent) return;

      const resField = state.fields.find((f) => f.name === resKey);
      const isMultiple = !!resField?.config?.multiple;

      let newResource: string | number | (string | number)[] | undefined = resVal;

      if (resField) {
        const eResource = droppedEvent[resKey as string];
        const currentRes = arraytizeFieldVal(resField, eResource, droppedEvent).value;

        if (isMultiple && resVal) {
          if (currentRes.includes(resVal)) {
            if (dayjs(droppedEvent.start).isSame(dayjs(startTime))) {
              return;
            }
            newResource = currentRes;
          } else {
            newResource = currentRes.length > 1 ? [...currentRes, resVal] : [resVal];
          }
        }
      }

      if (
        dayjs(droppedEvent.start).isSame(dayjs(startTime)) &&
        (!newResource || (!isMultiple && newResource === droppedEvent[resKey as string]))
      ) {
        return;
      }

      const diff = dayjs(droppedEvent.end).diff(dayjs(droppedEvent.start), 'minute');
      const updatedEvent: ProcessedEvent = {
        ...droppedEvent,
        start: startTime,
        end: dayjs(startTime).add(diff, 'minute').toDate(),
        recurring: undefined,
        [resKey as string]: newResource ?? '',
      };

      if (!state.onEventDrop || typeof state.onEventDrop !== 'function') {
        return confirmEvent(updatedEvent, 'edit');
      }

      try {
        triggerLoading(true);
        const result = await state.onEventDrop(event, startTime, updatedEvent, droppedEvent);
        if (result) {
          confirmEvent(result, 'edit');
        }
      } finally {
        triggerLoading(false);
      }
    },
    [state, triggerLoading]
  );

  const storeValue = useMemo<Store>(
    () => ({
      ...state,
      handleState,
      getViews,
      toggleAgenda,
      triggerDialog,
      triggerLoading,
      handleGotoDay,
      confirmEvent,
      setCurrentDragged,
      onDrop,
    }),
    [getViews, handleGotoDay, onDrop, state, toggleAgenda, triggerDialog, triggerLoading]
  );

  return <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>;
};
