import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { EditorDatePicker } from '../components/inputs/DatePicker';
import { EditorInput } from '../components/inputs/Input';
import { EditorSelect } from '../components/inputs/SelectInput';
import { arraytizeFieldVal, revertTimeZonedDate } from '../helpers/generals';
import useStore from '../hooks/useStore';
import { SelectedRange } from '../store/types';
import { EventActions, FieldInputProps, FieldProps, InputTypes, ProcessedEvent } from '@/lib';
import { dayjs } from '@/config/dayjs';
import { CustomDialogProps } from '@/lib/types.ts';

export type StateItem = {
  value: any;
  validity: boolean;
  type: InputTypes;
  config?: FieldInputProps;
};

export type StateEvent = (ProcessedEvent & SelectedRange) | Record<string, any>;

const initialState = (fields: FieldProps[], event?: StateEvent): Record<string, StateItem> => {
  const customFields = {} as Record<string, StateItem>;

  for (const field of fields) {
    const defVal = arraytizeFieldVal(field, field.default, event);
    const eveVal = arraytizeFieldVal(field, event?.[field.name], event);

    customFields[field.name] = {
      value: eveVal.value || defVal.value || '',
      validity: field.config?.required ? !!eveVal.validity || !!defVal.validity : true,
      type: field.type,
      config: field.config,
    };
  }

  return {
    event_id: {
      value: event?.event_id || null,
      validity: true,
      type: 'hidden',
    },
    title: {
      value: event?.title || '',
      validity: !!event?.title,
      type: 'input',
      config: { label: 'Title', required: true, min: 3 },
    },
    subtitle: {
      value: event?.subtitle || '',
      validity: true,
      type: 'input',
      config: { label: 'Subtitle', required: false },
    },
    start: {
      value: event?.start || new Date(),
      validity: true,
      type: 'date',
      config: { label: 'Start', sm: 6 },
    },
    end: {
      value: event?.end || new Date(),
      validity: true,
      type: 'date',
      config: { label: 'End', sm: 6 },
    },
    ...customFields,
  };
};

const Editor = () => {
  const {
    fields,
    dialog,
    triggerDialog,
    selectedRange,
    selectedEvent,
    triggerLoading,
    onConfirm,
    customDialog,
    confirmEvent,
    dialogMaxWidth,
    translations,
    timeZone,
  } = useStore();

  const [state, setState] = useState(initialState(fields, selectedEvent || selectedRange));
  const [touched, setTouched] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEditorState = (name: string, value: any, validity: boolean) => {
    setState((prev) => ({
      ...prev,
      [name]: { ...prev[name], value, validity },
    }));
  };

  const handleClose = (clearState?: boolean) => {
    if (clearState) {
      setState(initialState(fields));
    }
    triggerDialog(false);
  };

  const handleConfirm = async () => {
    let body = {} as ProcessedEvent;

    // Validate and build body
    for (const key in state) {
      body[key] = state[key].value;
      if (!customDialog && !state[key].validity) {
        return setTouched(true);
      }
    }

    try {
      triggerLoading(true);

      const startDayjs = dayjs(body.start);
      const endDayjs = dayjs(body.end);

      if (startDayjs.isSameOrAfter(endDayjs)) {
        if (selectedRange) {
          const rangeDiff = dayjs(selectedRange.end).diff(dayjs(selectedRange.start), 'minute');
          body.end = startDayjs.add(rangeDiff, 'minute').toDate();
        } else {
          body.end = startDayjs.add(30, 'minute').toDate();
        }
      }

      const action: EventActions = selectedEvent?.event_id ? 'edit' : 'create';

      if (onConfirm) {
        body = await onConfirm(body, action);
      } else {
        body.event_id =
          selectedEvent?.event_id ||
          `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
      }

      body.start = revertTimeZonedDate(body.start, timeZone);
      body.end = revertTimeZonedDate(body.end, timeZone);

      confirmEvent(body, action);
      handleClose(true);
    } catch (error) {
      console.error('Editor confirmation error:', error);
    } finally {
      triggerLoading(false);
    }
  };

  const renderInputs = (key: string) => {
    const stateItem = state[key];

    switch (stateItem.type) {
      case 'input':
        return (
          <EditorInput
            value={stateItem.value}
            name={key}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      case 'date':
        return (
          <EditorDatePicker
            value={stateItem.value}
            name={key}
            onChange={(...args) => handleEditorState(...args, true)}
            touched={touched}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      case 'select': {
        const field = fields.find((f) => f.name === key);
        return (
          <EditorSelect
            value={stateItem.value}
            name={key}
            options={field?.options || []}
            onChange={handleEditorState}
            touched={touched}
            {...stateItem.config}
            label={translations.event[key] || stateItem.config?.label}
          />
        );
      }
      default:
        return null;
    }
  };

  const DefaultDialog = () => (
    <Fragment>
      <DialogTitle>
        {selectedEvent ? translations.form.editTitle : translations.form.addTitle}
      </DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <Grid container spacing={2}>
          {Object.keys(state).map((key) => {
            const item = state[key];
            return (
              <Grid item key={key} sm={item.config?.sm} xs={12}>
                {renderInputs(key)}
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" fullWidth onClick={() => handleClose()}>
          {translations.form.cancel}
        </Button>
        <Button color="primary" fullWidth onClick={handleConfirm}>
          {translations.form.confirm}
        </Button>
      </DialogActions>
    </Fragment>
  );

  if (!dialog) return null;

  if (customDialog) {
    const customDialogProps: CustomDialogProps = {
      open: dialog,
      state,
      selectedEvent,
      close: () => triggerDialog(false),
      onConfirm: confirmEvent,
    };

    return customDialog(customDialogProps);
  }

  return (
    <Dialog
      open={dialog}
      fullScreen={isMobile}
      maxWidth={dialogMaxWidth}
      onClose={() => triggerDialog(false)}
    >
      <DefaultDialog />
    </Dialog>
  );
};

export default Editor;
