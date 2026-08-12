import { Scheduler } from '@/index.tsx';
import React from 'react';
import { ProcessedEvent } from '@/types.ts';

// Repro harness for the day-view header/body scroll desync (Earendel 2026-08-12):
// mirrors the consuming app's shape — many resources, bounded height, day default.
const RESOURCES = Array.from({ length: 12 }, (_, i) => ({
  resourceid: `room-${i + 1}`,
  name: `Room ${i + 1} with a fairly long venue name`,
  color: '#1a1a40',
}));

const day = new Date();
const at = (h: number, m = 0) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);

const EVENTS: ProcessedEvent[] = RESOURCES.flatMap((r, i) => [
  {
    event_id: `${r.resourceid}-a`,
    title: `M-${i * 2 + 1}`,
    start: at(9, (i % 3) * 10),
    end: at(11, (i % 3) * 10),
    resourceid: r.resourceid,
  },
  {
    event_id: `${r.resourceid}-b`,
    title: `M-${i * 2 + 2}`,
    start: at(12, (i % 4) * 10),
    end: at(14, (i % 4) * 10),
    resourceid: r.resourceid,
  },
]);

const App: React.FC = () => {
  return (
    <div className="p-4" style={{ height: 700 }}>
      <Scheduler
        height={700}
        view="day"
        day={{
          startHour: 5,
          endHour: 23,
          step: 60,
          navigation: true,
        }}
        month={null}
        week={null}
        events={EVENTS}
        resources={RESOURCES}
        resourceFields={{ idField: 'resourceid', textField: 'name' }}
        resourceViewMode="default"
        hourFormat="24"
      />
    </div>
  );
};

export default App;
