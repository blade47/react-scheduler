// @vitest-environment jsdom
import type { Scheduler } from '@/types.ts';

import { render } from '@testing-library/react';
import { expect, describe, it } from 'vitest';

import { StoreProvider } from '../../store/provider.tsx';
import { ResourceHeader } from './ResourceHeader.tsx';

// Regression for a crash that escaped the library entirely: ResourceHeader read
// `resource[resourceFields.textField]` and called `.charAt(0)` on it unguarded. A resource missing
// that field yields undefined, and a render-phase TypeError is NOT contained — React unmounts the
// tree and the CONSUMER's error boundary handles it. Downstream that meant a full page reload for
// a calendar with no resources configured, because Day's placeholder was keyed {id,text} while the
// consumer had remapped resourceFields. Both halves are fixed; this pins the resilient half, since
// a library must not take the host application down over one malformed resource.
function renderHeader(initial: Partial<Scheduler>, resource: Record<string, unknown>) {
  return render(
    <StoreProvider initial={initial as Scheduler}>
      <ResourceHeader resource={resource as never} />
    </StoreProvider>
  );
}

describe('ResourceHeader', () => {
  const fields = { idField: 'resourceid', textField: 'name' };

  it('renders without throwing when the resource has no value for the configured text field', () => {
    expect(() =>
      renderHeader({ resourceFields: fields } as Partial<Scheduler>, { resourceid: 'default' })
    ).not.toThrow();
  });

  it('still renders the text and its avatar initial when the field IS present', () => {
    // Guards the null-coalescing against over-reach: silencing the crash must not silence the name.
    const { getByText } = renderHeader({ resourceFields: fields } as Partial<Scheduler>, {
      resourceid: 'room-1',
      name: 'Aula Magna',
    });

    expect(getByText('Aula Magna')).toBeTruthy();
    expect(getByText('A')).toBeTruthy();
  });
});
