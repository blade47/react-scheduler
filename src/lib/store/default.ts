import { SchedulerProps, Translations } from '@/lib';
import { getTimeZonedDate } from '../helpers/generals';
import { OptionalSchedulerProps, RequiredSchedulerProps, Scheduler } from '@/lib/types.ts';
import { MonthProps } from '@/lib/views/Month.tsx';
import { WeekProps } from '@/lib/views/Week.tsx';
import { DayProps } from '@/lib/views/Day.tsx';

const defaultMonth: MonthProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 6,
  startHour: 9,
  endHour: 17,
  navigation: true,
  disableGoToDay: false,
};

const defaultWeek: WeekProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 6,
  startHour: 9,
  endHour: 17,
  step: 60,
  navigation: true,
  disableGoToDay: false,
};

const defaultDay: DayProps = {
  startHour: 9,
  endHour: 17,
  step: 60,
  navigation: true,
};

const defaultResourceFields = {
  idField: 'assignee',
  textField: 'text',
  subTextField: 'subtext',
  avatarField: 'avatar',
  colorField: 'color',
} as const;

const defaultTranslations = (trans: Partial<SchedulerProps['translations']> = {}): Translations => {
  const { navigation, form, event, validation, ...other } = trans;

  return {
    navigation: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
      today: 'Today',
      ...navigation,
    },
    form: {
      addTitle: 'Add Event',
      editTitle: 'Edit Event',
      confirm: 'Confirm',
      delete: 'Delete',
      cancel: 'Cancel',
      ...form,
    },
    event: {
      title: 'Title',
      start: 'Start',
      end: 'End',
      allDay: 'All Day',
      subtitle: 'Subtitle',
      ...event,
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email format',
      onlyNumbers: 'Only numbers are allowed',
      min: (min: number) => `Minimum ${min} characters required`,
      max: (max: number) => `Maximum ${max} characters allowed`,
      ...validation,
    },
    moreEvents: 'More...',
    loading: 'Loading...',
    noDataToDisplay: 'No data to display',
    ...other,
  };
};

export type View = 'month' | 'week' | 'day';

interface Views {
  month: MonthProps | null;
  week: WeekProps | null;
  day: DayProps | null;
}

const getOneView = (views: Views): View => {
  if (views.week !== null) return 'week';
  if (views.month !== null) return 'month';
  if (views.day !== null) return 'day';
  return 'week';
};

const defaultViews = (props: Scheduler): Views => {
  const { month, week, day } = props;
  return {
    month: month !== null ? { ...defaultMonth, ...month } : null,
    week: week !== null ? { ...defaultWeek, ...week } : null,
    day: day !== null ? { ...defaultDay, ...day } : null,
  };
};

export const defaultProps = (props: Scheduler): SchedulerProps => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    month,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    week,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    day,
    translations,
    resourceFields,
    view,
    selectedDate,
    ...otherProps
  } = props;

  const views = defaultViews(props);
  const defaultView: View = view || 'week';

  const isValidView = (view: View): view is View => {
    return views[view] !== null;
  };

  const initialView: View = isValidView(defaultView) ? defaultView : getOneView(views);

  const baseProps: RequiredSchedulerProps = {
    height: 600,
    view: initialView,
    selectedDate: getTimeZonedDate(selectedDate || new Date(), props.timeZone),
    events: [],
    fields: [],
    resources: [],
    resourceFields: { ...defaultResourceFields, ...resourceFields },
    resourceViewMode: 'default',
    direction: 'ltr',
    dialogMaxWidth: 'md',
    locale: 'en',
    translations: defaultTranslations(translations),
    hourFormat: '12',
  };

  const optionalProps: Partial<OptionalSchedulerProps> = {
    navigation: true,
    disableViewNavigator: false,
    loading: undefined,
    customEditor: undefined,
    onConfirm: undefined,
    onDelete: undefined,
    viewerExtraComponent: undefined,
    resourceHeaderComponent: undefined,
    deletable: true,
    editable: true,
    draggable: true,
    enableAgenda: true,
    enableTodayButton: true,
    maxDate: undefined,
    minDate: undefined,
    ...views,
    ...otherProps,
  };

  return {
    ...baseProps,
    ...optionalProps,
  };
};
