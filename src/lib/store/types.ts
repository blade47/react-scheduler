import { DragEvent } from 'react';
import { EventActions, ProcessedEvent } from '@/lib';
import { SchedulerStateBase, View } from '../types';

export type SelectedRange = { start: Date; end: Date };

export interface Store extends SchedulerStateBase {
  handleState(
    value: SchedulerStateBase[keyof SchedulerStateBase],
    name: keyof SchedulerStateBase
  ): void;
  getViews(): View[];
  toggleAgenda(): void;
  triggerDialog(status: boolean, event?: SelectedRange | ProcessedEvent): void;
  triggerLoading(status: boolean): void;
  handleGotoDay(day: Date): void;
  confirmEvent(event: ProcessedEvent | ProcessedEvent[], action: EventActions): void;
  setCurrentDragged(event?: ProcessedEvent): void;
  onDrop(
    event: DragEvent<HTMLButtonElement>,
    eventId: string,
    droppedStartTime: Date,
    resourceKey?: string,
    resourceVal?: string | number
  ): void;
}
