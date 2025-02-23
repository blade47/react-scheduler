import { Theme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';

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
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
        }),
        ...(outlinedVariant && {
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.main,
            boxShadow: '0 0 0 0.5px currentColor',
          },
        }),
        ...(textVariant && {
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
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
    };

    return [defaultStyle, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonProps }) => ({
          fontFamily: theme.typography.button.fontFamily,
          fontWeight: theme.typography.button.fontWeight,
          textTransform: 'capitalize',
          borderRadius: theme.shape.borderRadius,
          transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
          ...rootStyles(ownerState),
        }),
      },
    },
  };
}
