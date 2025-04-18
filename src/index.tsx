import '@fontsource/open-sans';
import '@fontsource/manrope';
import '@/config/dayjs.ts';
import { forwardRef } from 'react';
import { StoreProvider } from './store/provider.tsx';

import type {
  CalendarEvent,
  CellRenderedProps,
  DayHours,
  DefaultResource,
  EventActions,
  EventRendererProps,
  FieldInputProps,
  FieldProps,
  InputTypes,
  ProcessedEvent,
  RemoteQuery,
  ResourceFields,
  CustomDialogProps,
  Scheduler as SchedulerProps,
  SchedulerRef,
  Translations,
  View,
  DayProps,
  WeekProps,
} from './types.ts';
import { SchedulerComponent } from '@/components/scheduler/Scheduler.tsx';
import DateProvider from '@/components/providers/DateProvider.tsx';

/**
 * Scheduler Component
 *
 * A comprehensive scheduler/calendar component that supports:
 * - Multiple view types (day, week, month)
 * - Event management
 * - Resource scheduling
 * - Custom rendering
 *
 * @example
 * ```tsx
 * <Scheduler
 *   height={600}
 *   events={events}
 *   onEventClick={(event) => console.log(event)}
 *   locale="en|fr|es"
 * />
 * ```
 */
export const Scheduler = forwardRef<SchedulerRef, SchedulerProps>(function Scheduler(props, ref) {
  return (
    <DateProvider locale={props.locale ?? 'en'}>
      <StoreProvider initial={props}>
        <SchedulerComponent ref={ref} />
      </StoreProvider>
    </DateProvider>
  );
});

export type {
  // Event related types
  CalendarEvent,
  ProcessedEvent,
  EventActions,
  EventRendererProps,

  // Field related types
  FieldProps,
  FieldInputProps,
  InputTypes,

  // Resource related types
  DefaultResource,
  ResourceFields,

  // Helper types
  CustomDialogProps,
  SchedulerRef,

  // View related types
  DayHours,
  CellRenderedProps,
  DayProps,
  WeekProps,
  View,

  // Configuration types
  SchedulerProps,
  Translations,
  RemoteQuery,
};
