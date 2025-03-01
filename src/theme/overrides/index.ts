import { Theme } from '@mui/material/styles';

import { button } from './components/button.tsx';
import { typography } from './components/typography.tsx';
import { chip } from '@/theme/overrides/components/chip.tsx';
import { card } from '@/theme/overrides/components/card.tsx';

export function componentsOverrides(theme: Theme) {
  return {
    components: {
      ...button(theme),
      ...card(),
      ...chip(),
      ...typography(theme),
    },
  };
}
