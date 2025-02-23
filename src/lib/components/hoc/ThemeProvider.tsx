import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import React, { useMemo } from 'react';
import { palette } from '@/lib/theme/palette.ts';
import { typography } from '@/lib/theme/typography.ts';
import { shadows } from '@/lib/theme/shadows.ts';
import { componentsOverrides } from '@/lib/theme/overrides';
import merge from 'lodash.merge';

interface ThemeProviderProps {
  children: React.ReactNode;
  customTheme?: Partial<Theme>;
}

const ThemeProvider = ({ children, customTheme }: ThemeProviderProps) => {
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
