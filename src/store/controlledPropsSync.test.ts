import { describe, expect, it } from 'vitest';

import {
  hasControlledDateChanged,
  resolveControlledDate,
  resolveControlledWeekStartOn,
} from './controlledPropsSync';
import { WeekProps } from '@/types.ts';

const baseWeek: WeekProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 6,
  startHour: 9,
  endHour: 17,
  step: 60,
  navigation: true,
  disableGoToDay: false,
};

describe('resolveControlledDate', () => {
  it('keeps the previous value when the prop is not provided (additive-only)', () => {
    const previous = new Date('2026-07-01T00:00:00.000Z');
    expect(resolveControlledDate(undefined, previous)).toBe(previous);
    expect(resolveControlledDate(undefined, undefined)).toBeUndefined();
    expect(resolveControlledDate(undefined, null)).toBeNull();
  });

  it('honors an explicit null as clearing the bound', () => {
    const previous = new Date('2026-07-01T00:00:00.000Z');
    expect(resolveControlledDate(null, previous)).toBeNull();
  });

  it('does not create a new null when already null', () => {
    expect(resolveControlledDate(null, null)).toBeNull();
  });

  it('adopts a new Date value that differs from the previous one', () => {
    const previous = new Date('2026-07-01T00:00:00.000Z');
    const incoming = new Date('2026-08-01T00:00:00.000Z');
    expect(resolveControlledDate(incoming, previous)).toBe(incoming);
  });

  it('keeps the previous reference when the incoming Date has an equal value (different instance)', () => {
    const previous = new Date('2026-07-01T00:00:00.000Z');
    const incoming = new Date('2026-07-01T00:00:00.000Z');
    expect(incoming).not.toBe(previous);
    expect(resolveControlledDate(incoming, previous)).toBe(previous);
  });

  it('adopts the incoming Date when there was no previous value', () => {
    const incoming = new Date('2026-07-01T00:00:00.000Z');
    expect(resolveControlledDate(incoming, undefined)).toBe(incoming);
    expect(resolveControlledDate(incoming, null)).toBe(incoming);
  });
});

describe('resolveControlledWeekStartOn', () => {
  it('keeps the previous week config when weekStartOn is not provided', () => {
    expect(resolveControlledWeekStartOn(undefined, baseWeek)).toBe(baseWeek);
  });

  it('never resurrects a disabled week view', () => {
    expect(resolveControlledWeekStartOn(1, null)).toBeNull();
    expect(resolveControlledWeekStartOn(1, undefined)).toBeUndefined();
  });

  it('keeps the previous reference when weekStartOn is unchanged', () => {
    expect(resolveControlledWeekStartOn(baseWeek.weekStartOn, baseWeek)).toBe(baseWeek);
  });

  it('updates only weekStartOn, preserving every other field', () => {
    const result = resolveControlledWeekStartOn(1, baseWeek);
    expect(result).not.toBe(baseWeek);
    expect(result).toEqual({ ...baseWeek, weekStartOn: 1 });
  });
});

describe('hasControlledDateChanged', () => {
  it('is false when the prop is not provided', () => {
    expect(hasControlledDateChanged(undefined, undefined)).toBe(false);
    expect(hasControlledDateChanged(undefined, Date.now())).toBe(false);
  });

  it('is false when the incoming value matches the last-synced time', () => {
    const date = new Date('2026-07-01T00:00:00.000Z');
    expect(hasControlledDateChanged(date, date.getTime())).toBe(false);
  });

  it('is true the first time a value is synced (no prior lastSyncedTime)', () => {
    const date = new Date('2026-07-01T00:00:00.000Z');
    expect(hasControlledDateChanged(date, undefined)).toBe(true);
  });

  it('is true when the incoming value differs from the last-synced time, even across renders', () => {
    const lastSynced = new Date('2026-07-01T00:00:00.000Z').getTime();
    const incoming = new Date('2026-07-05T00:00:00.000Z');
    expect(hasControlledDateChanged(incoming, lastSynced)).toBe(true);
  });

  it('is false for a fresh Date instance carrying the same wall-clock value (reference churn is not a change)', () => {
    const lastSynced = new Date('2026-07-01T00:00:00.000Z').getTime();
    const incomingSameValueNewInstance = new Date('2026-07-01T00:00:00.000Z');
    expect(hasControlledDateChanged(incomingSameValueNewInstance, lastSynced)).toBe(false);
  });
});
