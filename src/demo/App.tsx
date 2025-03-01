import { Scheduler } from '@/index.tsx';
import React from 'react';
import { EVENTS } from '@/demo/events.ts';

const App: React.FC = () => {
  return (
    <div className="p-4">
      <div className="space-x-2">
        <Scheduler events={EVENTS} />
      </div>
    </div>
  );
};

export default App;
