import { useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { ButtonTabProps, DefaultResource, WithResourcesProps } from '@/lib/types.ts';
import { ResourceHeader } from './ResourceHeader';
import { ButtonTabs } from '@/lib/components/common/Tabs.tsx';

export const ResourcesTabTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, selectedResource, handleState, onResourceChange } = useStore();

  const tabs: ButtonTabProps[] = useMemo(
    () =>
      resources.map((res) => ({
        id: res[resourceFields.idField],
        label: <ResourceHeader resource={res} />,
        component: <>{renderChildren(res)}</>,
      })),
    [resources, resourceFields.idField, renderChildren]
  );

  const setTab = (tab: DefaultResource['assignee']) => {
    handleState(tab, 'selectedResource');
    if (typeof onResourceChange === 'function') {
      const selected = resources.find((re) => re[resourceFields.idField] === tab);
      if (selected) {
        onResourceChange(selected);
      }
    }
  };

  const currentTabSafeId = useMemo(() => {
    const firstId = resources[0]?.[resourceFields.idField];
    if (!selectedResource || !firstId) return firstId;

    return resources.some((re) => re[resourceFields.idField] === selectedResource)
      ? selectedResource
      : firstId;
  }, [resources, selectedResource, resourceFields.idField]);

  return <ButtonTabs tabs={tabs} tab={currentTabSafeId} setTab={setTab} />;
};
