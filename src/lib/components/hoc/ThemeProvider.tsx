import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import { deepmerge } from '@mui/utils';
import { palette } from '@/lib/theme/palette.ts';
import { typography } from '@/lib/theme/typography.ts';
import { shadows } from '@/lib/theme/shadows.ts';
import { componentsOverrides } from '@/lib/theme/overrides';

interface ThemeProviderProps {
  children: React.ReactNode;
  customTheme?: Partial<Theme>;
}

const ThemeProvider = ({ children, customTheme }: ThemeProviderProps) => {
  const theme = useMemo(() => {
    const baseTheme: ThemeOptions = {
      palette: palette(),
      shadows: shadows,
      typography,
      shape: {
        borderRadius: 8,
      },
    };

    let t = createTheme(baseTheme);

    t = createTheme(t, {
      components: componentsOverrides(t),
    });

    if (customTheme) {
      t = createTheme(deepmerge(t, customTheme));
    }

    return t;
  }, [customTheme]);

  // For debugging
  useEffect(() => {
    console.log('Scheduler theme:', theme.palette.primary);
  }, [theme]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
