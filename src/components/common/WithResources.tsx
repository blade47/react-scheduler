import React, { memo } from 'react';
import useStore from '../../hooks/useStore.ts';
import { ResourcesTabTables } from './ResourcesTabTables.tsx';
import { DefaultResource } from '@/types.ts';
import {
  DefaultResourceItem,
  ResourceContainer,
  VerticalContent,
  VerticalResourceWrapper,
  VerticalSidebar,
} from '@/theme/css.ts';
import { ResourceHeader } from '@/components/common/ResourceHeader.tsx';

export interface Props {
  renderChildren(resource: DefaultResource): React.ReactNode;
}

export const WithResources = memo(({ renderChildren }: Props) => {
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
