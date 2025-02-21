import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { IconButton, IconButtonProps } from '@mui/material';
import { MouseEvent, DragEvent, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { SvgIconComponent } from '@mui/icons-material';

interface LocaleArrowProps extends Omit<IconButtonProps, 'type'> {
  type: 'prev' | 'next';
  onClick?(e?: MouseEvent): void;
}

const LocaleArrow = ({ type, onClick, style, ...props }: LocaleArrowProps) => {
  const { direction } = useStore();

  const Arrow: SvgIconComponent = useMemo(() => {
    if (type === 'prev') {
      return direction === 'rtl' ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
    }
    return direction === 'rtl' ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
  }, [direction, type]);

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <IconButton
      style={{
        padding: 2,
        ...style,
      }}
      onClick={onClick}
      onDragOver={handleDragOver}
      {...props}
    >
      <Arrow />
    </IconButton>
  );
};

export { LocaleArrow };
