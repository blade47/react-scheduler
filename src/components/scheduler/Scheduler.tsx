import { forwardRef, useCallback, useMemo } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { LoadingOverlay, SchedulerContent, SchedulerWrapper } from '@/theme/css.ts';
import useStore from '@/hooks/useStore.ts';
import { SchedulerRef } from '@/index.tsx';
import { View } from '@/types.ts';
import { Navigation } from '@/components/nav/Navigation.tsx';
import { PositionProvider } from '@/positionManger/provider.tsx';
import { Day } from '@/views/day/Day.tsx';
import { Week } from '@/views/week/Week.tsx';
import { Month } from '@/views/month/Month.tsx';
import FormEditor from '@/views/FormEditor.tsx';

const ViewComponents = {
  day: <Day />,
  week: <Week />,
  month: <Month />,
} as const;

export const SchedulerComponent = forwardRef<SchedulerRef>((_, ref) => {
  const store = useStore();
  const { view, dialog, loading, loadingComponent, resourceViewMode, resources, translations } =
    store;

  const currentView = useMemo(() => ViewComponents[view as View], [view]);

  const handleRef = useCallback(
    (el: any | null) => {
      if (ref && 'current' in ref && el) {
        ref.current = { el, scheduler: store };
      }
    },
    [ref, store]
  );

  return (
    <SchedulerWrapper isDialog={dialog} data-testid="scheduler-wrapper" ref={handleRef}>
      {loading && (
        <LoadingOverlay>
          {loadingComponent || (
            <>
              <CircularProgress
                size={50}
                color="primary"
                sx={{
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))',
                }}
              />
              <Typography variant="h6" color="textSecondary">
                {translations.loading}
              </Typography>
            </>
          )}
        </LoadingOverlay>
      )}

      <Navigation />

      <SchedulerContent
        resourceCount={resourceViewMode === 'default' ? resources.length : 1}
        sx={{
          overflowX: resourceViewMode === 'default' && resources.length > 1 ? 'auto' : undefined,
          flexDirection: resourceViewMode === 'vertical' ? 'column' : undefined,
        }}
        data-testid="scheduler-grid"
      >
        <PositionProvider>{currentView}</PositionProvider>
      </SchedulerContent>

      {dialog && <FormEditor />}
    </SchedulerWrapper>
  );
});

SchedulerComponent.displayName = 'SchedulerComponent';
