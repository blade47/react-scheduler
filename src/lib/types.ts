import { DialogProps, GridSize, IconButtonProps, Theme } from '@mui/material';
import { DateCalendarProps } from '@mui/x-date-pickers';
import React, { CSSProperties, DragEvent, ReactElement, ReactNode, MouseEvent } from 'react';
import { SelectOption } from './components/inputs/SelectInput';
import { SelectedRange, Store } from './store/types';
import { StateItem } from './views/Editor';
import type { RRule } from 'rrule';
import { Dayjs } from 'dayjs';

export type View = 'month' | 'week' | 'day';

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

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

export interface AgendaEventsListProps {
  day: Date;
  events: ProcessedEvent[];
}

export interface EventDateFormat {
  isToday: boolean;
  format: string;
  formatted: string;
}

export interface AgendaEventItemProps {
  event: ProcessedEvent;
  onEventClick: (event: ProcessedEvent) => (e: MouseEvent) => void;
  startDate: EventDateFormat;
  endDate: EventDateFormat;
  disableViewer: boolean;
}

export interface EmptyAgendaProps {
  customMessage?: string;
}

export interface EventItemPopoverProps {
  event: ProcessedEvent;
  anchorEl: Element | null;
  onTriggerViewer: (el?: MouseEvent) => void;
}

export interface PopoverContentProps {
  event: ProcessedEvent;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onEdit: () => void;
  dateTimeText: string;
  resourcesText: string | null;
}

export interface TodayTypoProps {
  date: Date;
  onClick?(day: Date): void;
}

export interface EventItemProps {
  event: ProcessedEvent;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

export interface EventContentProps {
  event: ProcessedEvent;
  showTime: boolean;
  hFormat: string;
  multiday?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export interface CellProps {
  day: Date;
  start: Date;
  height: number;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  children?: JSX.Element;
}

export interface AgendaViewProps {
  events: ProcessedEvent[];
  view: View;
  daysList?: Date[];
}

export interface AgendaDayProps {
  day: Date;
  events: ProcessedEvent[];
  today: boolean;
  onDayClick?: (day: Date) => void;
}

export interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  endHour: number;
  step: number;
  minuteHeight: number;
  direction: 'rtl' | 'ltr';
  timeZone?: string;
}

export interface EventPositionProps {
  event: ProcessedEvent;
  crossingEvents: ProcessedEvent[];
  alreadyRendered: ProcessedEvent[];
  direction: 'rtl' | 'ltr';
}

export interface EventDimensionsProps {
  event: ProcessedEvent;
  startHour: number;
  minuteHeight: number;
  maxHeight: number;
  step: number;
}

export type TabVariant = 'scrollable' | 'standard' | 'fullWidth';
export type TabIndicator = 'primary' | 'secondary' | 'info' | 'error';

export interface TabPanelProps {
  value: string | number;
  index: string | number;
  children: ReactNode;
}

export interface ButtonTabProps {
  id: string | number;
  label: string | JSX.Element;
  component: JSX.Element;
}

export interface ButtonTabsProps {
  tabs: ButtonTabProps[];
  tab: string | number;
  setTab(tab: string | number): void;
  variant?: TabVariant;
  indicator?: TabIndicator;
  style?: CSSProperties;
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

export interface ResourceHeaderProps {
  resource: DefaultResource;
}

export interface WithResourcesProps {
  renderChildren(resource: DefaultResource): React.ReactNode;
}

export type ResourceViewMode = 'default' | 'tabs' | 'vertical';

export type ArrowDirection = 'prev' | 'next';
export type LocaleDirection = 'rtl' | 'ltr';

export interface LocaleArrowProps extends Omit<IconButtonProps, 'type'> {
  type: ArrowDirection;
  onClick?(e?: MouseEvent): void;
}

export interface RequiredSchedulerProps {
  height: number;
  view: View;
  selectedDate: Date;
  events: ProcessedEvent[];
  fields: FieldProps[];
  resources: DefaultResource[];
  resourceFields: ResourceFields;
  resourceViewMode: ResourceViewMode;
  direction: LocaleDirection;
  dialogMaxWidth: DialogProps['maxWidth'];
  locale: string;
  translations: Translations;
  hourFormat: '12' | '24';
}

export interface DayProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
}

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  hourRenderer?(hour: string): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

export interface MonthProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  headRenderer?(day: Date): JSX.Element;
  navigation?: boolean;
  disableGoToDay?: boolean;
}

export interface OptionalSchedulerProps {
  agenda?: boolean;
  enableAgenda?: boolean;
  enableTodayButton?: boolean;
  theme?: Partial<Theme>;
  alwaysShowAgendaDays?: boolean;
  month: MonthProps | null;
  week: WeekProps | null;
  day: DayProps | null;
  minDate: Date | null;
  maxDate: Date | null;
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
  customDialog?: (props: CustomDialogProps) => ReactElement;
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

export type Scheduler = Partial<Omit<SchedulerProps, 'agenda'>>;

export interface CustomDialogProps {
  open: boolean;
  state: Record<string, StateItem>;
  selectedEvent?: ProcessedEvent;
  close(): void;
  onConfirm(event: ProcessedEvent | ProcessedEvent[], action: EventActions): void;
}
