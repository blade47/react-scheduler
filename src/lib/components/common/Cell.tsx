import { Button } from '@mui/material';
import { useCellAttributes } from '../../hooks/useCellAttributes';
import { CellRenderedProps } from '@/lib';
import { dayjs } from '@/config/dayjs';

interface CellProps {
  day: Date;
  start: Date;
  height: number;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
  children?: JSX.Element;
}

const Cell = ({
  day,
  start,
  end,
  resourceKey,
  resourceVal,
  cellRenderer,
  height,
  children,
}: CellProps) => {
  const cellAttributes = useCellAttributes({
    start,
    end,
    resourceKey,
    resourceVal,
  });

  const formatDateRange = (): string => {
    const startDayjs = dayjs(start);
    const endDayjs = dayjs(end);
    const format = 'dddd, MMMM D, YYYY h:mm:ss A z';

    return `${startDayjs.format(format)} - ${endDayjs.format(format)}`;
  };

  if (cellRenderer) {
    return cellRenderer({
      day,
      start,
      end,
      height,
      ...cellAttributes,
    });
  }

  return (
    <Button fullWidth aria-label={formatDateRange()} {...cellAttributes}>
      {children}
    </Button>
  );
};

export default Cell;
