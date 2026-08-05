// @vitest-environment jsdom
import type { Scheduler } from '@/types.ts';
import type { Store } from './types.ts';

import { render } from '@testing-library/react';
import { vi, expect, describe, it } from 'vitest';

import useStore from '../hooks/useStore.ts';
import { StoreProvider } from './provider.tsx';

// Regression for the mount-only-callbacks bug: the prop-sync effect historically covered
// events/resources/drag-drop/editable/…, but NOT onEventClick and friends — those were captured
// once via defaultProps at mount. A consumer that added onEventClick on a LATER render (e.g. a
// selection mode activating on an already-mounted calendar) found every click silently dead.
// This pins the contract: pure config/callback props follow the CURRENT render's props.

let captured: Store | undefined;

function Probe() {
  captured = useStore();
  return null;
}

function renderProvider(initial: Scheduler) {
  return render(
    <StoreProvider initial={initial}>
      <Probe />
    </StoreProvider>
  );
}

describe('StoreProvider prop sync', () => {
  it('adopts callback props that first appear after mount', () => {
    const { rerender } = renderProvider({} as Scheduler);
    expect(captured?.onEventClick).toBeUndefined();

    const onEventClick = vi.fn();
    const onEventEdit = vi.fn();
    const onDelete = vi.fn(async () => undefined);
    const onConfirm = vi.fn(async (event: never) => event);
    const onResourceChange = vi.fn();
    const eventRenderer = vi.fn(() => null);
    const customViewer = vi.fn(() => <div />);
    const resourceHeaderComponent = vi.fn(() => <div />);

    rerender(
      <StoreProvider
        initial={
          {
            onEventClick,
            onEventEdit,
            onDelete,
            onConfirm,
            onResourceChange,
            eventRenderer,
            customViewer,
            resourceHeaderComponent,
          } as unknown as Scheduler
        }
      >
        <Probe />
      </StoreProvider>
    );

    expect(captured?.onEventClick).toBe(onEventClick);
    expect(captured?.onEventEdit).toBe(onEventEdit);
    expect(captured?.onDelete).toBe(onDelete);
    expect(captured?.onConfirm).toBe(onConfirm);
    expect(captured?.onResourceChange).toBe(onResourceChange);
    expect(captured?.eventRenderer).toBe(eventRenderer);
    expect(captured?.customViewer).toBe(customViewer);
    expect(captured?.resourceHeaderComponent).toBe(resourceHeaderComponent);
  });

  it('follows flag props across renders while keeping the last value when omitted', () => {
    const { rerender } = renderProvider({} as Scheduler);

    rerender(
      <StoreProvider initial={{ disableViewer: true, deletable: false } as unknown as Scheduler}>
        <Probe />
      </StoreProvider>
    );
    expect(captured?.disableViewer).toBe(true);
    expect(captured?.deletable).toBe(false);

    // Omitting the flag again keeps the last value rather than snapping to undefined —
    // same `?? previous` contract editable/draggable/resizable already follow.
    rerender(
      <StoreProvider initial={{} as Scheduler}>
        <Probe />
      </StoreProvider>
    );
    expect(captured?.disableViewer).toBe(true);
  });

  it('drops a callback the consumer removes', () => {
    const onEventClick = vi.fn();
    const { rerender } = renderProvider({ onEventClick } as unknown as Scheduler);
    expect(captured?.onEventClick).toBe(onEventClick);

    rerender(
      <StoreProvider initial={{} as Scheduler}>
        <Probe />
      </StoreProvider>
    );
    expect(captured?.onEventClick).toBeUndefined();
  });
});
