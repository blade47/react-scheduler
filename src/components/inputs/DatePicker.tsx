import { useCallback, useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useStore from '../../hooks/useStore.ts';
import { dayjs } from '@/config/dayjs.ts';
import type { Dayjs } from 'dayjs';

interface Props {
  type?: 'date' | 'datetime';
  label?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  value: Date | string;
  name: string;
  onChange(name: string, date: Date): void;
  error?: boolean;
  errMsg?: string;
  touched?: boolean;
  required?: boolean;
}

interface PickerState {
  touched: boolean;
  valid: boolean;
  errorMsg?: string;
}

const EditorDatePicker = ({
  type = 'datetime',
  value,
  label,
  name,
  onChange,
  variant = 'outlined',
  error,
  errMsg,
  touched,
  required,
}: Props) => {
  const { translations } = useStore();

  const [state, setState] = useState<PickerState>({
    touched: false,
    valid: !!value,
    errorMsg: errMsg
      ? errMsg
      : required
        ? translations?.validation?.required || 'Required'
        : undefined,
  });

  const Picker = type === 'date' ? DatePicker : DateTimePicker;
  const hasError = state.touched && (error || !state.valid);

  const handleChange = useCallback(
    (value: string | Date | null) => {
      if (!value) {
        setState((prev) => ({
          ...prev,
          touched: true,
          valid: !required,
          errorMsg: required ? translations?.validation?.required || 'Required' : undefined,
        }));
        return;
      }

      const valueDayjs = dayjs(value);
      const isValidDate = valueDayjs.isValid();

      const val = typeof value === 'string' && isValidDate ? valueDayjs.toDate() : value;

      setState((prev) => ({
        ...prev,
        touched: true,
        valid: true,
        errorMsg: errMsg,
      }));

      onChange(name, val as Date);
    },
    [errMsg, name, onChange, required, translations?.validation?.required]
  );

  useEffect(() => {
    if (touched) {
      handleChange(value);
    }
  }, [handleChange, touched, value]);

  const valueDayjs = dayjs(value);

  return (
    <Picker
      value={valueDayjs.isValid() ? valueDayjs : null}
      label={label}
      onChange={(newValue: Dayjs | null) => {
        if (newValue) {
          handleChange(newValue.toDate());
        } else {
          handleChange(null);
        }
      }}
      minutesStep={5}
      slotProps={{
        textField: {
          variant,
          helperText: hasError ? state.errorMsg : undefined,
          error: hasError,
          fullWidth: true,
        },
      }}
    />
  );
};

export { EditorDatePicker };
