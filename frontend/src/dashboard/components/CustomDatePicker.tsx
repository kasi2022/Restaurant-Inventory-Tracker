import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useForkRef } from '@mui/material/utils';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ButtonFieldProps extends DatePickerFieldProps {}

function ButtonField(props: ButtonFieldProps) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

export default function CustomDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs()); // Default to today
  const [note, setNote] = React.useState('');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DatePicker
          value={value}
          label={value == null ? null : value.format('MMM DD, YYYY')}
          onChange={(newValue) => {
            setValue(newValue);
            setNote('');
          }}
          slots={{ field: ButtonField }}
          slotProps={{
            nextIconButton: { size: 'small' },
            previousIconButton: { size: 'small' },
          }}
          views={['day', 'month', 'year']}
        />

        {/* 👇 Display current selected date */}
        {value && (
          <Typography variant="body2" color="textSecondary">
            Selected Date: <strong>{value.format('MMMM DD, YYYY')}</strong>
          </Typography>
        )}

        {value && (
          <TextField
            label={`Note for ${value.format('MMM DD, YYYY')}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            size="small"
            multiline
            minRows={2}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
}
