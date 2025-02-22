import { alpha, Theme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';
import { MODERN_STYLES } from '@/lib/theme/common.ts';

export function button(theme: Theme) {
  const rootStyles = (ownerState: ButtonProps) => {
    const inheritColor = ownerState.color === 'inherit';

    const containedVariant = ownerState.variant === 'contained';

    const outlinedVariant = ownerState.variant === 'outlined';

    const textVariant = ownerState.variant === 'text';

    const smallSize = ownerState.size === 'small';

    const mediumSize = ownerState.size === 'medium';

    const largeSize = ownerState.size === 'large';

    const defaultStyle = {
      ...(inheritColor && {
        ...(containedVariant && {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.grey[700],
          },
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
        }),
        ...(outlinedVariant && {
          borderColor: alpha(theme.palette.grey[500], 0.32),
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        ...(textVariant && {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      }),
      ...(outlinedVariant && {
        '&:hover': {
          borderColor: 'currentColor',
          boxShadow: '0 0 0 0.5px currentColor',
        },
      }),
    };

    const size = {
      ...(smallSize && {
        height: 30,
        fontSize: 13,
        paddingLeft: 8,
        paddingRight: 8,
        ...(textVariant && {
          paddingLeft: 4,
          paddingRight: 4,
        }),
      }),
      ...(mediumSize && {
        paddingLeft: 12,
        paddingRight: 12,
        ...(textVariant && {
          paddingLeft: 8,
          paddingRight: 8,
        }),
      }),
      ...(largeSize && {
        height: 48,
        fontSize: 15,
        paddingLeft: 16,
        paddingRight: 16,
        ...(textVariant && {
          paddingLeft: 10,
          paddingRight: 10,
        }),
      }),
      '&.rs__cell_button': {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        cursor: 'pointer',
        transition: MODERN_STYLES.transition,
        '&:hover': {
          background: `${theme.palette.primary.main}14`,
        },
      },
    };

    return [defaultStyle, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonProps }) => rootStyles(ownerState),
      },
    },
  };
}
