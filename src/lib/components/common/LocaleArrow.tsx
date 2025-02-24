import { memo, useMemo, DragEvent, MouseEvent } from 'react';
import useStore from '../../hooks/useStore';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { ArrowDirection, LocaleDirection } from '@/lib/types.ts';
import { SvgIconComponent } from '@mui/icons-material';
import { ArrowButton } from '@/lib/theme/css.ts';
import { IconButtonProps } from '@mui/material';

export interface Props extends Omit<IconButtonProps, 'type'> {
  type: ArrowDirection;
  onClick?(e?: MouseEvent): void;
}

export const LocaleArrow = memo(
  ({ type, onClick, style, className, disabled, ...props }: Props) => {
    const { direction = 'ltr' } = useStore();

    const getArrowIcon = (type: ArrowDirection, direction: LocaleDirection): SvgIconComponent => {
      if (type === 'prev') {
        return direction === 'rtl' ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
      }
      return direction === 'rtl' ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
    };

    const Arrow = useMemo(() => getArrowIcon(type, direction), [direction, type]);

    const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!disabled && onClick) {
        onClick();
      }
    };

    return (
      <ArrowButton
        className={className}
        disabled={disabled}
        onClick={onClick}
        onDragOver={handleDragOver}
        style={style}
        aria-label={type === 'prev' ? 'Previous' : 'Next'}
        {...props}
      >
        <Arrow />
      </ArrowButton>
    );
  }
);

LocaleArrow.displayName = 'LocaleArrow';
