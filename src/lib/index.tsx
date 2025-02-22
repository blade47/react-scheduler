import '@/config/dayjs';
import { forwardRef } from 'react';
import { StoreProvider } from './store/provider';

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
  SchedulerHelpers,
  Scheduler as SchedulerProps,
  SchedulerRef,
  Translations,
} from './types';
import DateProvider from '@/lib/components/hoc/DateProvider.tsx';
import SchedulerComponent from '@/lib/SchedulerComponent.tsx';
import ThemeProvider from './components/hoc/ThemeProvider';

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
export const Scheduler = forwardRef<SchedulerRef, SchedulerProps>(function Scheduler(
  { locale = 'en', theme: customTheme, ...props },
  ref
) {
  return (
    <ThemeProvider customTheme={customTheme}>
      <DateProvider locale={locale}>
        <StoreProvider initial={props}>
          <SchedulerComponent ref={ref} />
        </StoreProvider>
      </DateProvider>
    </ThemeProvider>
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
  SchedulerHelpers,
  SchedulerRef,

  // View related types
  DayHours,
  CellRenderedProps,

  // Configuration types
  SchedulerProps,
  Translations,
  RemoteQuery,
};
