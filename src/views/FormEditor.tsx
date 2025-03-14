import { FC } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
  Box,
  Checkbox,
  Chip,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import { dayjs } from '@/config/dayjs.ts';
import DialogAnimate from '@/components/common/DialogAnimate.tsx';
import useStore from '@/hooks/useStore.ts';
import { useFormState } from '@/components/inputs/hooks/useFormState.ts';
import { CustomDialogProps, EventActions, FieldProps, ProcessedEvent } from '@/types.ts';
import {
  StyledButton,
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
  StyledSection,
} from '@/theme/css.ts';

const toDayjs = (date: any) => {
  if (!date) return null;
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate : null;
};

const FormEditor: FC = () => {
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
    selectedResource,
  } = useStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { form, formState, updateFormState } = useFormState(fields, selectedEvent, selectedRange);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleClose = () => {
    reset();
    triggerDialog(false);
  };

  const onSubmit = async (data: any) => {
    try {
      triggerLoading(true);

      let body = { ...data } as ProcessedEvent;
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
          body.event_id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
      }

      Object.entries(body).forEach(([key, value]) => {
        updateFormState(key, value, true);
      });

      if (timeZone) {
        body.start = dayjs(body.start).tz(timeZone).toDate();
        body.end = dayjs(body.end).tz(timeZone).toDate();
      }

      confirmEvent(body, action);
      handleClose();
    } catch (error) {
      console.error('Editor confirmation error:', error);
    } finally {
      triggerLoading(false);
    }
  };

  const renderField = (field: FieldProps) => {
    const commonProps = {
      fullWidth: true,
      variant: field.config?.variant || 'outlined',
      size: 'medium' as const,
      disabled: field.config?.disabled,
      label: translations.event[field.name] || field.config?.label,
      error: !!errors[field.name],
      helperText: errors[field.name]?.message as string,
      required: field.config?.required,
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
        },
      },
    };

    switch (field.type) {
      case 'input':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                {...commonProps}
                value={value}
                onChange={onChange}
                type={field.config?.email ? 'email' : 'text'}
                multiline={field.config?.multiline}
                rows={field.config?.rows}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                {...commonProps}
                value={value}
                onChange={onChange}
                type="number"
                inputProps={{
                  min: field.config?.min,
                  max: field.config?.max,
                  step: field.config?.decimal ? '0.01' : '1',
                }}
              />
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                {...commonProps}
                value={toDayjs(value)}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.toDate() : null);
                }}
                slotProps={{
                  textField: {
                    ...commonProps,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        );

      case 'datetime':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                {...commonProps}
                value={toDayjs(value)}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.toDate() : null);
                }}
                slotProps={{
                  textField: {
                    ...commonProps,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                {...commonProps}
                select
                value={value}
                onChange={onChange}
                SelectProps={{
                  multiple: field.config?.multiple !== undefined,
                  renderValue:
                    field.config?.multiple === 'chips'
                      ? (selected: any) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value: any) => (
                              <Chip
                                key={value}
                                label={field.options?.find((opt) => opt.value === value)?.text}
                                size="small"
                              />
                            ))}
                          </Box>
                        )
                      : undefined,
                }}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {field.config?.multiple && (
                      <Checkbox checked={Array.isArray(value) && value.includes(option.value)} />
                    )}
                    {option.text}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        );

      default:
        return null;
    }
  };

  const renderDefaultContent = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StyledDialogTitle>
        <Typography>
          {selectedEvent ? translations.form.editTitle : translations.form.addTitle}
        </Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        <Stack spacing={4}>
          <StyledSection>
            <Typography className="section-title">Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Title"
                      error={!!errors.title}
                      helperText={errors.title?.message as string}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="subtitle"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Subtitle"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledSection>

          <StyledSection>
            <Typography className="section-title">Date and Time</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="start"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label="Start"
                      value={toDayjs(value)}
                      onChange={(newValue) => {
                        onChange(newValue ? newValue.toDate() : null);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.start,
                          helperText: errors.start?.message as string,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="end"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label="End"
                      value={toDayjs(value)}
                      onChange={(newValue) => {
                        onChange(newValue ? newValue.toDate() : null);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.end,
                          helperText: errors.end?.message as string,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledSection>

          {fields.length > 0 && (
            <StyledSection>
              <Typography className="section-title" gutterBottom>
                Additional Details
              </Typography>
              <Grid container spacing={2}>
                {fields.map((field) => (
                  <Grid
                    item
                    key={field.name}
                    xs={field.config?.xs || 12}
                    sm={field.config?.sm}
                    md={field.config?.md}
                  >
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>
            </StyledSection>
          )}
        </Stack>
      </StyledDialogContent>

      <StyledDialogActions>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <StyledButton onClick={handleClose} variant="outlined" color="inherit" fullWidth>
            {translations.form.cancel}
          </StyledButton>
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            {translations.form.confirm}
          </StyledButton>
        </Box>
      </StyledDialogActions>
    </form>
  );

  if (!dialog) return null;

  if (customDialog) {
    const customDialogProps: CustomDialogProps = {
      open: dialog,
      state: formState,
      selectedEvent,
      selectedResource,
      close: handleClose,
      onConfirm: confirmEvent,
    };

    return customDialog(customDialogProps);
  }

  return (
    <DialogAnimate
      open={dialog}
      fullScreen={isMobile}
      maxWidth={dialogMaxWidth}
      onClose={handleClose}
    >
      {renderDefaultContent()}
    </DialogAnimate>
  );
};

export default FormEditor;
