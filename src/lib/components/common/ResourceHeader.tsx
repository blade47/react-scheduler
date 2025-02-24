import { Avatar, Typography, useTheme } from '@mui/material';
import useStore from '../../hooks/useStore';
import { DefaultResource, ResourceViewMode } from '@/lib/types.ts';
import { ResourceAvatar, ResourceContent, ResourceListItem } from '@/lib/theme/css.ts';

export interface LocalResourceFields {
  text: string;
  subtext?: string;
  avatar?: string;
  color?: string;
}

export interface Props {
  resource: DefaultResource;
}

export const ResourceHeader = ({ resource }: Props) => {
  const {
    resourceHeaderComponent,
    resourceFields,
    direction = 'ltr',
    resourceViewMode = 'default',
  } = useStore();

  const theme = useTheme();

  const getResourceFields = (): LocalResourceFields => ({
    text: resource[resourceFields.textField],
    subtext: resource[resourceFields.subTextField || ''],
    avatar: resource[resourceFields.avatarField || ''],
    color: resource[resourceFields.colorField || ''],
  });

  if (typeof resourceHeaderComponent === 'function') {
    return resourceHeaderComponent(resource);
  }

  const { text, subtext, avatar, color } = getResourceFields();
  const shouldWrapText = resourceViewMode !== 'vertical';

  const renderAvatar = () => {
    if (avatar) {
      return (
        <Avatar
          sx={{
            bgcolor: color || theme.palette.primary.main,
            width: 36,
            height: 36,
          }}
          alt={text}
          src={avatar}
        />
      );
    }

    return <ResourceAvatar color={color}>{text.charAt(0).toUpperCase()}</ResourceAvatar>;
  };

  return (
    <ResourceListItem
      viewMode={resourceViewMode as ResourceViewMode}
      direction={direction as 'ltr' | 'rtl'}
    >
      {renderAvatar()}
      <ResourceContent viewMode={resourceViewMode as ResourceViewMode}>
        <Typography
          variant="body2"
          noWrap={shouldWrapText}
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.text.primary,
          }}
        >
          {text}
        </Typography>
        {subtext && (
          <Typography
            variant="caption"
            noWrap={shouldWrapText}
            sx={{
              color: theme.palette.text.secondary,
              display: 'block',
              marginTop: 0.25,
            }}
          >
            {subtext}
          </Typography>
        )}
      </ResourceContent>
    </ResourceListItem>
  );
};
