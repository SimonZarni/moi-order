import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();

  const singleLogo = (
    <Box
      component="img"
      src="/assets/icons/moi-order-icon.png"
      alt="Moi Order"
      sx={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover', display: 'block' }}
    />
  );

  const fullLogo = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        component="img"
        src="/assets/icons/moi-order-icon.png"
        alt="Moi Order"
        sx={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
      />
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, color: theme.vars.palette.text.primary, whiteSpace: 'nowrap' }}
      >
        Moi Order
      </Typography>
    </Box>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 'auto', height: 40 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
