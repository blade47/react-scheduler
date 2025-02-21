import { DialogProps, GridSize } from '@mui/material';
import { DateCalendarProps } from '@mui/x-date-pickers';
import { DragEvent, ReactElement, ReactNode } from 'react';
import { SelectOption } from './components/inputs/SelectInput';
import { View } from './components/nav/Navigation';
import { SelectedRange, Store } from './store/types';
import { DayProps } from './views/Day';
import { StateItem } from './views/Editor';
import { MonthProps } from './views/Month';
import { WeekProps } from './views/Week';
import type { RRule } from 'rrule';
import { Dayjs } from 'dayjs';

export type DayHours =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export interface CellRenderedProps {
  day: Date;
  start: Date;
  end: Date;
  height: number;
  onClick(): void;
  onDragOver(e: DragEvent<HTMLButtonElement>): void;
  onDragEnter(e: DragEvent<HTMLButtonElement>): void;
  onDragLeave(e: DragEvent<HTMLButtonElement>): void;
  onDrop(e: DragEvent<HTMLButtonElement>): void;
}

export interface CalendarEvent {
  event_id: number | string;
  title: ReactNode;
  subtitle?: ReactNode;
  start: Date;
  end: Date;
  recurring?: RRule;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  editable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  allDay?: boolean;
  agendaAvatar?: ReactElement | string;
}

export interface Translations {
  navigation: Record<View, string> & {
    today: string;
    agenda: string;
  };
  form: {
    addTitle: string;
    editTitle: string;
    confirm: string;
    delete: string;
    cancel: string;
  };
  event: {
    title: string;
    subtitle: string;
    start: string;
    end: string;
    allDay: string;
    [key: string]: string;
  };
  validation?: {
    required?: string;
    invalidEmail?: string;
    onlyNumbers?: string;
    min?: string | ((min: number) => string);
    max?: string | ((max: number) => string);
  };
  moreEvents: string;
  noDataToDisplay: string;
  loading: string;
}

export type InputTypes = 'input' | 'date' | 'select' | 'hidden';

export interface EventRendererProps {
  event: ProcessedEvent;
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  onDragOver?: (e: DragEvent<HTMLElement>) => void;
  onDragEnter?: (e: DragEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface FieldInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  disabled?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
  decimal?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: 'date' | 'datetime';
  multiple?: 'chips' | 'default';
  loading?: boolean;
  errMsg?: string;
  md?: GridSize;
  sm?: GridSize;
  xs?: GridSize;
}

export interface FieldProps {
  name: string;
  type: InputTypes;
  options?: SelectOption[];
  default?: unknown;
  config?: FieldInputProps;
}

export type ProcessedEvent = CalendarEvent & Record<string, any>;
export type EventActions = 'create' | 'edit';
export type RemoteQuery = {
  start: Date;
  end: Date;
  view: 'day' | 'week' | 'month';
};

export type DefaultResource = {
  assignee?: string | number;
  text?: string;
  subtext?: string;
  avatar?: string;
  color?: string;
} & Record<string, any>;

export type ResourceFields = {
  idField: string;
  textField: string;
  subTextField?: string;
  avatarField?: string;
  colorField?: string;
} & Record<string, string>;

export interface SchedulerHelpers {
  state: Record<string, StateItem>;
  close(): void;
  loading(status: boolean): void;
  edited?: ProcessedEvent;
  onConfirm(event: ProcessedEvent | ProcessedEvent[], action: EventActions): void;
  [resourceKey: string]: unknown;
}

export interface RequiredSchedulerProps {
  height: number;
  view: View;
  selectedDate: Date;
  events: ProcessedEvent[];
  fields: FieldProps[];
  resources: DefaultResource[];
  resourceFields: ResourceFields;
  resourceViewMode: 'default' | 'vertical' | 'tabs';
  direction: 'rtl' | 'ltr';
  dialogMaxWidth: DialogProps['maxWidth'];
  locale: string;
  translations: Translations;
  hourFormat: '12' | '24';
}

export interface OptionalSchedulerProps {
  agenda?: boolean;
  alwaysShowAgendaDays?: boolean;
  month: MonthProps | null;
  week: WeekProps | null;
  day: DayProps | null;
  navigation?: boolean;
  disableViewNavigator?: boolean;
  navigationPickerProps?: Partial<
    Omit<
      DateCalendarProps<Dayjs>,
      'open' | 'onClose' | 'openTo' | 'views' | 'value' | 'readOnly' | 'onChange'
    >
  >;
  eventRenderer?: (props: EventRendererProps) => ReactElement | null;
  getRemoteEvents?(params: RemoteQuery): Promise<ProcessedEvent[] | void>;
  loading?: boolean;
  loadingComponent?: ReactElement;
  onConfirm?(event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent>;
  onDelete?(deletedId: string | number): Promise<string | number | void>;
  customEditor?(scheduler: SchedulerHelpers): ReactElement;
  customViewer?(event: ProcessedEvent, close: () => void): ReactElement;
  viewerExtraComponent?:
    | ReactElement
    | ((fields: FieldProps[], event: ProcessedEvent) => ReactElement);
  viewerTitleComponent?(event: ProcessedEvent): ReactElement;
  viewerSubtitleComponent?(event: ProcessedEvent): ReactElement;
  disableViewer?: boolean;
  resourceHeaderComponent?(resource: DefaultResource): ReactElement;
  onResourceChange?(resource: DefaultResource): void;
  timeZone?: string;
  onEventDrop?(
    event: DragEvent<HTMLButtonElement>,
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ): Promise<ProcessedEvent | void>;
  onEventClick?(event: ProcessedEvent): void;
  onEventEdit?(event: ProcessedEvent): void;
  deletable?: boolean;
  editable?: boolean;
  draggable?: boolean;
  onSelectedDateChange?(date: Date): void;
  onViewChange?(view: View, agenda?: boolean): void;
  stickyNavigation?: boolean;
  onClickMore?(date: Date, goToDay: (date: Date) => void): void;
  onCellClick?(start: Date, end: Date, resourceKey?: string, resourceVal?: string | number): void;
}

export interface SchedulerProps extends RequiredSchedulerProps, OptionalSchedulerProps {}

export interface SchedulerStateBase extends SchedulerProps {
  dialog: boolean;
  selectedRange?: SelectedRange;
  selectedEvent?: ProcessedEvent;
  selectedResource?: DefaultResource['assignee'];
  currentDragged?: ProcessedEvent;
  enableAgenda?: boolean;
}

export interface SchedulerRef {
  el: HTMLDivElement;
  scheduler: Store;
}

export type Scheduler = Partial<SchedulerProps>;
