import { TabPanelProps } from '@/lib/types.ts';
import { TabPanel as TabPanelStyle } from '@/lib/theme/css.ts';

export const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) return null;

  return (
    <TabPanelStyle role="tabpanel" aria-labelledby={`tab-${index}`}>
      {children}
    </TabPanelStyle>
  );
};
