import { CSSProperties, ReactNode } from 'react';
import { Tabs, Tab, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TabPanelProps {
  value: string | number;
  index: string | number;
  children: ReactNode;
}

interface ButtonTabProps {
  id: string | number;
  label: string | JSX.Element;
  component: JSX.Element;
}

interface ButtonTabsProps {
  tabs: ButtonTabProps[];
  tab: string | number;
  setTab(tab: string | number): void;
  variant?: 'scrollable' | 'standard' | 'fullWidth';
  indicator?: 'primary' | 'secondary' | 'info' | 'error';
  style?: CSSProperties;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return value === index ? <>{children}</> : null;
};

const a11yProps = (index: string | number) => ({
  id: `scrollable-auto-tab-${index}`,
  'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

const StyledTabs = styled('div')(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  alignSelf: 'center',
  '& .tabs': {
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderWidth: 1,
    '& button.MuiTab-root': {
      borderColor: theme.palette.grey[300],
      borderRightStyle: 'solid',
      borderWidth: 1,
    },
  },
  '& .primary': {
    background: theme.palette.primary.main,
  },
  '& .secondary': {
    background: theme.palette.secondary.main,
  },
  '& .error': {
    background: theme.palette.error.main,
  },
  '& .info': {
    background: theme.palette.info.dark,
  },
  '& .text_primary': {
    color: theme.palette.primary.main,
  },
  '& .text_secondary': {
    color: theme.palette.secondary.main,
  },
  '& .text_error': {
    color: theme.palette.error.main,
  },
  '& .text_info': {
    color: theme.palette.info.dark,
  },
}));

const ButtonTabs = ({
  tabs,
  variant = 'scrollable',
  tab,
  setTab,
  indicator = 'primary',
  style,
}: ButtonTabsProps) => {
  const handleTabChange = (tabId: string | number) => {
    setTab(tabId);
  };

  return (
    <StyledTabs style={style}>
      <Tabs value={tab} variant={variant} scrollButtons className="tabs" classes={{ indicator }}>
        {tabs.map((tabItem: ButtonTabProps, index: number) => (
          <Tab
            key={tabItem.id || index}
            label={tabItem.label}
            sx={{ flex: 1, flexBasis: 200, flexShrink: 0 }}
            value={tabItem.id}
            {...a11yProps(tabItem.id)}
            onClick={() => handleTabChange(tabItem.id)}
            onDragEnter={() => handleTabChange(tabItem.id)}
          />
        ))}
      </Tabs>

      {tabs.map(
        (tabItem: ButtonTabProps, index: number) =>
          tabItem.component && (
            <TabPanel key={tabItem.id || index} value={tab} index={tabItem.id}>
              {tabItem.component}
            </TabPanel>
          )
      )}
    </StyledTabs>
  );
};

export { ButtonTabs, type ButtonTabProps };
