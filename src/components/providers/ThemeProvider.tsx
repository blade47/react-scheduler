import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import React, { useMemo } from 'react';
import { palette } from '@/theme/palette.ts';
import { typography } from '@/theme/typography.ts';
import { shadows } from '@/theme/shadows.ts';
import { componentsOverrides } from '@/theme/overrides';
import merge from 'lodash.merge';

interface Props {
  children: React.ReactNode;
  customTheme?: Partial<Theme>;
}

const ThemeProvider = ({ children, customTheme }: Props) => {
  const theme = useMemo(() => {
    const baseOptions: ThemeOptions = {
      palette: palette(),
      shadows: shadows,
      typography,
      shape: {
        borderRadius: 8,
      },
    };

    const baseTheme = createTheme(baseOptions);

    const themeWithOverrides = createTheme(baseTheme, {
      components: componentsOverrides(baseTheme),
    });

    if (customTheme) {
      return createTheme(merge(themeWithOverrides, customTheme));
    }

    return themeWithOverrides;
  }, [customTheme]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
