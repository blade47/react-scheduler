import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import { DefaultResource } from '@/lib';
import useStore from '../../hooks/useStore';

interface ResourceHeaderProps {
  resource: DefaultResource;
}

interface ResourceFields {
  text: string;
  subtext: string | undefined;
  avatar: string | undefined;
  color: string | undefined;
}

const ResourceHeader = ({ resource }: ResourceHeaderProps) => {
  const { resourceHeaderComponent, resourceFields, direction, resourceViewMode } = useStore();

  const theme = useTheme();

  const getResourceFields = (): ResourceFields => ({
    text: resource[resourceFields.textField],
    subtext: resource[resourceFields.subTextField || ''],
    avatar: resource[resourceFields.avatarField || ''],
    color: resource[resourceFields.colorField || ''],
  });

  const getListItemStyles = (): SxProps<Theme> => {
    const baseStyles = {
      padding: '2px 10px',
      textAlign: direction === 'rtl' ? 'right' : 'left',
    };

    switch (resourceViewMode) {
      case 'tabs':
        return baseStyles;
      case 'vertical':
        return {
          ...baseStyles,
          display: 'block',
          textAlign: 'center',
          position: 'sticky',
          top: 4,
        };
      default:
        return {
          ...baseStyles,
          borderColor: theme.palette.grey[300],
          borderStyle: 'solid',
          borderWidth: 1,
        };
    }
  };

  if (typeof resourceHeaderComponent === 'function') {
    return resourceHeaderComponent(resource);
  }

  const { text, subtext, avatar, color } = getResourceFields();
  const shouldWrapText = resourceViewMode !== 'vertical';

  return (
    <ListItem sx={getListItemStyles()} component="div">
      <ListItemAvatar>
        <Avatar sx={{ background: color, margin: 'auto' }} alt={text} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" noWrap={shouldWrapText}>
            {text}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="textSecondary" noWrap={shouldWrapText}>
            {subtext}
          </Typography>
        }
      />
    </ListItem>
  );
};

export { ResourceHeader };
