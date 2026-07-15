import dayjs from 'dayjs';

export interface CalculateResizedEndInput {
  start: Date;
  originalEnd: Date;
  maxEnd: Date;
  originClientY: number;
  currentClientY: number;
  renderedHeight: number;
  stepMinutes: number;
}

export interface ShiftResizedEndInput {
  start: Date;
  currentEnd: Date;
  maxEnd: Date;
  stepMinutes: number;
  direction: -1 | 1;
}

const clampDuration = (
  start: Date,
  requestedMinutes: number,
  maxEnd: Date,
  stepMinutes: number
): Date => {
  const maximumMinutes = Math.max(stepMinutes, dayjs(maxEnd).diff(start, 'minute'));
  const durationMinutes = Math.min(Math.max(stepMinutes, requestedMinutes), maximumMinutes);
  return dayjs(start).add(durationMinutes, 'minute').toDate();
};

export const calculateResizedEnd = ({
  start,
  originalEnd,
  maxEnd,
  originClientY,
  currentClientY,
  renderedHeight,
  stepMinutes,
}: CalculateResizedEndInput): Date => {
  const originalMinutes = Math.max(stepMinutes, dayjs(originalEnd).diff(start, 'minute'));
  const safeHeight = Math.max(1, renderedHeight);
  const minutesPerPixel = originalMinutes / safeHeight;
  const rawDelta = (currentClientY - originClientY) * minutesPerPixel;
  const snappedDelta = Math.round(rawDelta / stepMinutes) * stepMinutes;
  return clampDuration(start, originalMinutes + snappedDelta, maxEnd, stepMinutes);
};

export const shiftResizedEnd = ({
  start,
  currentEnd,
  maxEnd,
  stepMinutes,
  direction,
}: ShiftResizedEndInput): Date => {
  const currentMinutes = dayjs(currentEnd).diff(start, 'minute');
  return clampDuration(start, currentMinutes + direction * stepMinutes, maxEnd, stepMinutes);
};
