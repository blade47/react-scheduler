import { Theme } from '@mui/material/styles';

import { button } from './components/button';
import { typography } from './components/typography';
import { chip } from '@/lib/theme/overrides/components/chip.tsx';
import { card } from '@/lib/theme/overrides/components/card.tsx';

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
