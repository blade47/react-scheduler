import { useCallback } from 'react';
import { ButtonTabsProps } from '@/lib/types.ts';
import { StyledTab, StyledTabs, TabsContainer } from '@/lib/theme/css.ts';
import { TabPanel } from '@/lib/components/common/TabPanel.tsx';

const getA11yProps = (index: string | number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export const ButtonTabs = ({
  tabs,
  variant = 'scrollable',
  tab,
  setTab,
  indicator = 'primary',
}: ButtonTabsProps) => {
  const handleTabChange = useCallback(
    (tabId: string | number) => {
      setTab(tabId);
    },
    [setTab]
  );

  const handleDragEnter = useCallback(
    (tabId: string | number) => {
      handleTabChange(tabId);
    },
    [handleTabChange]
  );

  return (
    <TabsContainer>
      <StyledTabs
        value={tab}
        variant={variant}
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{
          className: indicator,
        }}
      >
        {tabs.map((tabItem, index) => (
          <StyledTab
            key={tabItem.id || index}
            label={tabItem.label}
            value={tabItem.id}
            {...getA11yProps(tabItem.id)}
            onClick={() => handleTabChange(tabItem.id)}
            onDragEnter={() => handleDragEnter(tabItem.id)}
            sx={{
              flex: variant === 'fullWidth' ? 1 : 'initial',
              minWidth: 120,
            }}
          />
        ))}
      </StyledTabs>

      {tabs.map(
        (tabItem, index) =>
          tabItem.component && (
            <TabPanel key={tabItem.id || index} value={tab} index={tabItem.id}>
              {tabItem.component}
            </TabPanel>
          )
      )}
    </TabsContainer>
  );
};
