import { forwardRef, useCallback, useMemo } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { LoadingOverlay, SchedulerContent, SchedulerWrapper } from '@/lib/theme/css.ts';
import useStore from '@/lib/hooks/useStore.ts';
import { SchedulerRef } from '@/lib';
import { View } from '@/lib/types.ts';
import { Navigation } from '@/lib/components/nav/Navigation.tsx';
import { PositionProvider } from '@/lib/positionManger/provider.tsx';
import Editor from '@/lib/views/Editor.tsx';
import { Day } from '@/lib/views/day/Day.tsx';
import { Week } from '@/lib/views/week/Week.tsx';
import { Month } from '@/lib/views/month/Month.tsx';

export const ViewComponents = {
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

      {dialog && <Editor />}
    </SchedulerWrapper>
  );
});

SchedulerComponent.displayName = 'SchedulerComponent';
