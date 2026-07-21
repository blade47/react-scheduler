// @vitest-environment jsdom
import type { ProcessedEvent } from '@/types.ts';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, describe, it, beforeEach } from 'vitest';

import useEventResize from './useEventResize.ts';

// vi.mock hoists above every import, so this static import receives the mocked store. The shared
// spies come from vi.hoisted (repo convention) so the hoisted factory doesn't hit the TDZ.
const { onEventResize, confirmEvent, triggerLoading } = vi.hoisted(() => ({
  onEventResize: vi.fn(),
  confirmEvent: vi.fn(),
  triggerLoading: vi.fn(),
}));

vi.mock('./useStore.ts', () => ({
  default: () => ({
    view: 'day',
    day: { step: 60, endHour: 24 },
    week: { step: 60, endHour: 24 },
    onEventResize,
    confirmEvent,
    triggerLoading,
  }),
}));

const makeEvent = (): ProcessedEvent => ({
  event_id: 'e1',
  title: 'Talk',
  start: new Date('2026-07-15T09:00:00'),
  end: new Date('2026-07-15T10:00:00'),
});

function Harness({ event, enabled = true }: { event: ProcessedEvent; enabled?: boolean }) {
  const { resizeHandleProps } = useEventResize(event, enabled);
  return (
    <div className="rs__event__item" data-testid="item">
      {resizeHandleProps ? (
        <span
          data-testid="handle"
          {...resizeHandleProps}
          draggable={false}
          onDragStart={(dragEvent) => {
            dragEvent.preventDefault();
            dragEvent.stopPropagation();
          }}
        />
      ) : null}
    </div>
  );
}

const primeHandle = () => {
  const item = screen.getByTestId('item');
  const handle = screen.getByTestId('handle');
  item.getBoundingClientRect = () =>
    ({ height: 60, top: 0, bottom: 60, left: 0, right: 100, width: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  handle.setPointerCapture = vi.fn();
  handle.hasPointerCapture = vi.fn(() => true);
  handle.releasePointerCapture = vi.fn();
  return { item, handle };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useEventResize', () => {
  it('exposes an ARIA triad as minutes-from-start that stays valid at the midnight boundary', () => {
    render(<Harness event={makeEvent()} />);
    const handle = screen.getByTestId('handle');
    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('aria-valuemin')).toBe('60'); // start + one 60m step
    expect(handle.getAttribute('aria-valuemax')).toBe('900'); // 09:00 -> next-day 00:00 = 15h
    expect(handle.getAttribute('aria-valuenow')).toBe('60'); // 09:00 -> 10:00
    expect(Number(handle.getAttribute('aria-valuemax'))).toBeGreaterThan(
      Number(handle.getAttribute('aria-valuemin'))
    );
  });

  it('renders no handle when disabled', () => {
    render(<Harness event={makeEvent()} enabled={false} />);
    expect(screen.queryByTestId('handle')).toBeNull();
  });

  it('prevents native drag on the handle', () => {
    render(<Harness event={makeEvent()} />);
    const { handle } = primeHandle();
    expect(handle.getAttribute('draggable')).toBe('false');
    expect(fireEvent.dragStart(handle)).toBe(false); // preventDefault -> dispatch returns false
  });

  it('commits the resized end through onEventResize and syncs aria-valuenow during the drag', async () => {
    onEventResize.mockResolvedValue({ ...makeEvent(), end: new Date('2026-07-15T11:00:00') });
    render(<Harness event={makeEvent()} />);
    const { handle } = primeHandle();
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 160 }); // +60px over 60px = +60m
    expect(handle.getAttribute('aria-valuenow')).toBe('120'); // duration 09:00 -> 11:00
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 160 });
    await waitFor(() => expect(onEventResize).toHaveBeenCalledTimes(1));
    expect((onEventResize.mock.calls[0][0] as ProcessedEvent).end).toEqual(new Date('2026-07-15T11:00:00'));
    await waitFor(() => expect(confirmEvent).toHaveBeenCalledWith(expect.objectContaining({ event_id: 'e1' }), 'edit'));
    expect(triggerLoading).toHaveBeenNthCalledWith(1, true);
    expect(triggerLoading).toHaveBeenLastCalledWith(false);
  });

  it('reverts (no confirm, height restored, loading cleared) when the resize API rejects', async () => {
    onEventResize.mockRejectedValue(new Error('500'));
    render(<Harness event={makeEvent()} />);
    const { item, handle } = primeHandle();
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 160 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 160 });
    await waitFor(() => expect(triggerLoading).toHaveBeenLastCalledWith(false));
    expect(confirmEvent).not.toHaveBeenCalled();
    expect(item.style.height).toBe('60px'); // restored to the original rendered height
  });

  it('commits a keyboard ArrowDown step', async () => {
    onEventResize.mockResolvedValue({ ...makeEvent(), end: new Date('2026-07-15T11:00:00') });
    render(<Harness event={makeEvent()} />);
    const { handle } = primeHandle();
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    await waitFor(() => expect(onEventResize).toHaveBeenCalledTimes(1));
    expect((onEventResize.mock.calls[0][0] as ProcessedEvent).end).toEqual(new Date('2026-07-15T11:00:00'));
  });
});
