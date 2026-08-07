import { AgendaView } from '../agenda/AgendaView.tsx';
import { filterMultiDaySlot, generateHourSlots } from '../../helpers/generals.tsx';
import { dayjs } from '@/config/dayjs.ts';
import useStore from '@/hooks/useStore.ts';
import { MULTI_DAY_EVENT_HEADER_HEIGHT, MULTI_DAY_EVENT_HEIGHT } from '@/helpers/constants.ts';
import { useDayEvents } from '@/views/day/hooks/useDayEvents.ts';
import { DayGrid } from '@/views/day/components/DayGrid.tsx';

export const Day = () => {
  const { selectedDate, resources, agenda, day, timeZone, resourceFields } = useStore();

  const selectedDayjs = dayjs(selectedDate);

  const { startHour, endHour, step } = day!;

  const startTime = selectedDayjs.hour(startHour).minute(0).second(0).toDate();
  const endTime = selectedDayjs.hour(endHour).minute(-step).second(0).toDate();

  const events = useDayEvents(startTime, endTime);

  const hours = generateHourSlots(startTime, endTime, step);

  // Calculate header height once for all resources
  const allMulti = filterMultiDaySlot(events, selectedDate, timeZone);
  const headerHeight = MULTI_DAY_EVENT_HEIGHT * allMulti.length + MULTI_DAY_EVENT_HEADER_HEIGHT;

  // Handle the case where there are no resources
  if (resources.length === 0) {
    // Create a default resource to still show the day view, keyed by the CONSUMER's resourceFields
    // rather than literal id/text. Every reader of a resource looks its fields up through
    // resourceFields, so a placeholder with hardcoded keys is invisible to all of them as soon as a
    // consumer remaps the fields — ResourceHeader then read `resource[textField]` as undefined and
    // threw on `.charAt(0)`, which React escalates out of the library into the consumer's error
    // boundary. Reported downstream as "no rooms configured makes the day view reload the page".
    const defaultResource = [
      { [resourceFields.idField]: 'default', [resourceFields.textField]: 'Default' },
    ];

    return agenda ? (
      <AgendaView view="day" events={events} />
    ) : (
      <DayGrid
        resources={defaultResource}
        events={events}
        headerHeight={headerHeight}
        selectedDate={selectedDate}
        hours={hours}
      />
    );
  }

  return agenda ? (
    <AgendaView view="day" events={events} />
  ) : (
    <DayGrid
      resources={resources}
      events={events}
      headerHeight={headerHeight}
      selectedDate={selectedDate}
      hours={hours}
    />
  );
};
