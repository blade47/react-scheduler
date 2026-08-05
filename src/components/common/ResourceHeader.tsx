import { Avatar, Typography, useTheme } from '@mui/material';
import useStore from '../../hooks/useStore.ts';
import { DefaultResource, ResourceViewMode } from '@/types.ts';
import { ResourceAvatar, ResourceContent, ResourceListItem } from '@/theme/css.ts';

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
  // Horizontal modes (tabs / side-by-side columns) render compact: real deployments carry many
  // resources with venue-length names, and uneven multi-line headers broke tab alignment. The
  // full name stays reachable via the native title tooltip below.
  const compact = resourceViewMode !== 'vertical';

  const renderAvatar = () => {
    if (avatar) {
      return (
        <Avatar
          sx={{
            bgcolor: color || theme.palette.primary.main,
            width: compact ? 24 : 36,
            height: compact ? 24 : 36,
          }}
          alt={text}
          src={avatar}
        />
      );
    }

    return (
      <ResourceAvatar color={color} compact={compact}>
        {text.charAt(0).toUpperCase()}
      </ResourceAvatar>
    );
  };

  return (
    <ResourceListItem
      viewMode={resourceViewMode as ResourceViewMode}
      direction={direction as 'ltr' | 'rtl'}
      title={subtext ? `${text} — ${subtext}` : text}
    >
      {renderAvatar()}
      <ResourceContent viewMode={resourceViewMode as ResourceViewMode}>
        <Typography
          variant={compact ? 'caption' : 'body2'}
          sx={{
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.text.primary,
            // Two-line clamp instead of free wrap: uniform header heights at any name length.
            ...(compact
              ? {
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  lineHeight: 1.25,
                  // Direct declaration: TableGrid's `.rs__header > :first-of-type` nowrap wins
                  // the specificity fight on the list item, but the clamp needs wrapping — a
                  // direct value here beats the inherited one unconditionally.
                  whiteSpace: 'normal',
                }
              : {}),
          }}
        >
          {text}
        </Typography>
        {subtext && (
          <Typography
            variant="caption"
            noWrap={compact}
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
