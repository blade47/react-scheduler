import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FieldProps, FormState, ProcessedEvent, StateItem } from '@/types';
import { arraytizeFieldVal } from '@/helpers/generals.tsx';
import { SelectedRange } from '@/store/types.ts';

const getValidatorByType = (field: FieldProps): yup.AnySchema => {
  const { type, config } = field;

  switch (type) {
    case 'input': {
      let stringValidator = yup.string();

      if (config?.required) {
        stringValidator = stringValidator.required(config.errMsg || 'This field is required');
      }
      if (config?.min) {
        stringValidator = stringValidator.min(config.min, `Minimum ${config.min} characters`);
      }
      if (config?.max) {
        stringValidator = stringValidator.max(config.max, `Maximum ${config.max} characters`);
      }
      if (config?.email) {
        stringValidator = stringValidator.email('Invalid email address');
      }
      return stringValidator;
    }

    case 'number': {
      let numberValidator = yup.number();

      if (config?.required) {
        numberValidator = numberValidator.required(config.errMsg || 'This field is required');
      }
      if (config?.min !== undefined) {
        numberValidator = numberValidator.min(config.min, `Minimum value is ${config.min}`);
      }
      if (config?.max !== undefined) {
        numberValidator = numberValidator.max(config.max, `Maximum value is ${config.max}`);
      }
      return numberValidator;
    }

    case 'date':
    case 'datetime': {
      let dateValidator = yup.date();

      if (config?.required) {
        dateValidator = dateValidator.required(config.errMsg || 'This field is required');
      }
      return dateValidator;
    }

    case 'select': {
      if (config?.multiple) {
        let arrayValidator = yup.array();
        if (config.required) {
          arrayValidator = arrayValidator.min(1, 'At least one option must be selected');
        }
        return arrayValidator;
      }
      let selectValidator = yup.mixed();
      if (config?.required) {
        selectValidator = selectValidator.required(config.errMsg || 'This field is required');
      }
      return selectValidator;
    }

    case 'hidden':
      return yup.mixed().nullable();

    default:
      return yup.mixed();
  }
};

const createValidationSchema = (fields: FieldProps[]) => {
  const schemaFields: Record<string, any> = {
    event_id: yup.mixed().nullable(),
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    subtitle: yup.string(),
    start: yup.date().required('Start date is required'),
    end: yup.date().required('End date is required'),
  };

  fields.forEach((field) => {
    schemaFields[field.name] = getValidatorByType(field);
  });

  return yup.object().shape(schemaFields);
};

const createInitialState = (
  fields: FieldProps[],
  event?: Partial<ProcessedEvent>,
  selectedRange?: SelectedRange
): FormState => {
  const customFields: Record<string, StateItem> = {};

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
      config: undefined,
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
      value: event?.start || selectedRange?.start || new Date(),
      validity: true,
      type: 'date',
      config: { label: 'Start', sm: 6 },
    },
    end: {
      value: event?.end || selectedRange?.end || new Date(),
      validity: true,
      type: 'date',
      config: { label: 'End', sm: 6 },
    },
    ...customFields,
  };
};

export const useFormState = (
  fields: FieldProps[],
  selectedEvent?: ProcessedEvent,
  selectedRange?: SelectedRange
) => {
  const [formState, setFormState] = useState<FormState>(
    createInitialState(fields, selectedEvent, selectedRange)
  );

  const defaultValues = Object.entries(formState).reduce(
    (acc, [key, item]) => ({
      ...acc,
      [key]: item.value,
    }),
    {}
  );

  const form = useForm({
    defaultValues,
    resolver: yupResolver(createValidationSchema(fields)),
  });

  const updateFormState = useCallback((name: string, value: any, validity: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        validity,
      },
    }));
  }, []);

  return {
    form,
    formState,
    updateFormState,
  };
};
