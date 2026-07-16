import { WeekDays, WeekProps } from '@/types.ts';

/**
 * Resolves the next value for a controlled, optional `Date` prop (e.g. `minDate`, `maxDate`)
 * against the value currently held in the store.
 *
 * - `undefined` means the prop was not supplied by the consumer for this render: the previous
 *   store value is kept untouched (additive-only — consumers who never pass the prop see no
 *   behavior change).
 * - `null` is a deliberate "clear the bound" value and is honored.
 * - Equal `Date` values (compared by `getTime()`, since `Date` instances are never referentially
 *   stable across renders) resolve to the *previous* reference, so the store doesn't churn a new
 *   object identity — and therefore doesn't retrigger this sync — on every unrelated render.
 */
export const resolveControlledDate = (
  incoming: Date | null | undefined,
  previous: Date | null | undefined
): Date | null | undefined => {
  if (incoming === undefined) return previous;
  if (incoming === null) return previous === null ? previous : null;
  if (previous && previous.getTime() === incoming.getTime()) return previous;
  return incoming;
};

/**
 * Resolves the next `weekStartOn` for the store's `week` config against a controlled `week` prop.
 *
 * Only `weekStartOn` is synced (per the controlled-props contract) — every other field of the
 * store's `week` config (rendering options, callbacks, etc.) is left untouched. Sync is skipped
 * entirely when the week view is currently disabled (`previous` is `null`/`undefined`) so this
 * can never silently re-enable a week view a consumer explicitly turned off.
 */
export const resolveControlledWeekStartOn = (
  incomingWeekStartOn: WeekDays | undefined,
  previous: WeekProps | null | undefined
): WeekProps | null | undefined => {
  if (incomingWeekStartOn === undefined) return previous;
  if (!previous) return previous;
  if (previous.weekStartOn === incomingWeekStartOn) return previous;
  return { ...previous, weekStartOn: incomingWeekStartOn };
};

/**
 * Determines whether a controlled `selectedDate` prop has actually changed value since the last
 * time it was synced into the store.
 *
 * `selectedDate` is unlike `minDate`/`maxDate`/`week` in that internal navigation
 * (`handleGotoDay`, view navigation) mutates the store's `selectedDate` directly, so the store's
 * current value can legitimately diverge from the last-known prop value. Comparing against the
 * store would cause every unrelated re-render (where the consumer passes a new `Date` instance
 * with the same wall-clock value) to be misread as "the prop changed" and clobber the user's
 * in-progress navigation. Callers must track `lastSyncedTime` themselves (e.g. via `useRef`) and
 * update it whenever this returns `true`.
 */
export const hasControlledDateChanged = (
  incoming: Date | undefined,
  lastSyncedTime: number | undefined
): boolean => {
  if (incoming === undefined) return false;
  return incoming.getTime() !== lastSyncedTime;
};
