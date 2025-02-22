import { memo } from 'react';
import useStore from '../../hooks/useStore';
import { ResourcesTabTables } from './ResourcesTabTables';
import { WithResourcesProps } from '@/lib/types.ts';
import {
  DefaultResourceItem,
  ResourceContainer,
  VerticalContent,
  VerticalResourceWrapper,
  VerticalSidebar,
} from '@/lib/theme/css.ts';
import { ResourceHeader } from '@/lib/components/common/ResourceHeader.tsx';

export const WithResources = memo(({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, resourceViewMode } = useStore();

  if (resourceViewMode === 'tabs') {
    return <ResourcesTabTables renderChildren={renderChildren} />;
  }

  if (resourceViewMode === 'vertical') {
    return (
      <ResourceContainer>
        {resources.map((res, i) => (
          <VerticalResourceWrapper key={`${res[resourceFields.idField]}_${i}`}>
            <VerticalSidebar>
              <ResourceHeader resource={res} />
            </VerticalSidebar>
            <VerticalContent>{renderChildren(res)}</VerticalContent>
          </VerticalResourceWrapper>
        ))}
      </ResourceContainer>
    );
  }

  return (
    <ResourceContainer>
      {resources.map((res, i) => (
        <DefaultResourceItem key={`${res[resourceFields.idField]}_${i}`}>
          <ResourceHeader resource={res} />
          {renderChildren(res)}
        </DefaultResourceItem>
      ))}
    </ResourceContainer>
  );
});

WithResources.displayName = 'WithResources';
