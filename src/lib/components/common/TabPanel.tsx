import { TabPanel as TabPanelStyle } from '@/lib/theme/css.ts';
import { ReactNode } from 'react';

export interface Props {
  value: string | number;
  index: string | number;
  children: ReactNode;
}

export const TabPanel = ({ children, value, index }: Props) => {
  if (value !== index) return null;

  return (
    <TabPanelStyle role="tabpanel" aria-labelledby={`tab-${index}`}>
      {children}
    </TabPanelStyle>
  );
};
