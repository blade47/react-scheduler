import { describe, expect, it } from 'vitest';

import { calculateResizedEnd, shiftResizedEnd } from './eventResize';

const start = new Date('2026-07-15T09:00:00.000Z');
const end = new Date('2026-07-15T10:00:00.000Z');
const maxEnd = new Date('2026-07-15T18:00:00.000Z');

describe('calculateResizedEnd', () => {
  it('snaps a pointer extension to the active 15-minute step', () => {
    expect(
      calculateResizedEnd({
        start,
        originalEnd: end,
        maxEnd,
        originClientY: 100,
        currentClientY: 127,
        renderedHeight: 60,
        stepMinutes: 15,
      })
    ).toEqual(new Date('2026-07-15T10:30:00.000Z'));
  });

  it('never shrinks below one calendar step', () => {
    expect(
      calculateResizedEnd({
        start,
        originalEnd: end,
        maxEnd,
        originClientY: 100,
        currentClientY: -500,
        renderedHeight: 60,
        stepMinutes: 15,
      })
    ).toEqual(new Date('2026-07-15T09:15:00.000Z'));
  });

  it('never extends beyond the configured day boundary', () => {
    expect(
      calculateResizedEnd({
        start,
        originalEnd: end,
        maxEnd: new Date('2026-07-15T10:15:00.000Z'),
        originClientY: 100,
        currentClientY: 500,
        renderedHeight: 60,
        stepMinutes: 15,
      })
    ).toEqual(new Date('2026-07-15T10:15:00.000Z'));
  });
});

describe('shiftResizedEnd', () => {
  it('moves one keyboard step and applies the same bounds', () => {
    expect(
      shiftResizedEnd({ start, currentEnd: end, maxEnd, stepMinutes: 15, direction: 1 })
    ).toEqual(new Date('2026-07-15T10:15:00.000Z'));
    expect(
      shiftResizedEnd({
        start,
        currentEnd: new Date('2026-07-15T09:15:00.000Z'),
        maxEnd,
        stepMinutes: 15,
        direction: -1,
      })
    ).toEqual(new Date('2026-07-15T09:15:00.000Z'));
  });
});
