import { Scheduler } from '@/index.tsx';
import React from 'react';
import { EVENTS } from '@/demo/events.ts';

const App: React.FC = () => {
  return (
    <div className="p-4">
      <div className="space-x-2">
        <Scheduler
          day={{
            startHour: 5,
            endHour: 23,
            step: 60,
            navigation: true,
          }}
          month={null}
          week={{
            weekDays: [1, 2, 3, 4, 5, 6, 0],
            weekStartOn: 0,
            startHour: 5,
            endHour: 23,
            step: 60,
          }}
          events={EVENTS}
          hourFormat="24"
        />
      </div>
    </div>
  );
};

export default App;
