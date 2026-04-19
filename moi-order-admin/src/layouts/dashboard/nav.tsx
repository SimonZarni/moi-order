import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { NavItem } from '../nav-config-dashboard';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: { topArea?: React.ReactNode; bottomArea?: React.ReactNode };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx, data, slots, workspaces, layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx, data, open, slots, onClose, workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

function NavItemRow({ item, isActive }: { item: Omit<NavItem, 'children'>; isActive: boolean }) {
  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        disableGutters
        component={RouterLink}
        href={item.path}
        sx={[
          (theme) => ({
            pl: 2, py: 1, gap: 2, pr: 1.5,
            borderRadius: 0.75,
            typography: 'body2',
            fontWeight: 'fontWeightMedium',
            color: theme.vars.palette.text.secondary,
            minHeight: 44,
            ...(isActive && {
              fontWeight: 'fontWeightSemiBold',
              color: theme.vars.palette.primary.main,
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
              '&:hover': { bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16) },
            }),
          }),
        ]}
      >
        <Box component="span" sx={{ width: 24, height: 24 }}>{item.icon}</Box>
        <Box component="span" sx={{ flexGrow: 1 }}>{item.title}</Box>
        {item.info && item.info}
      </ListItemButton>
    </ListItem>
  );
}

// ----------------------------------------------------------------------

function NavGroupRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some((c) => c.path === pathname) ?? false;
  const [open, setOpen] = useState(isChildActive);

  return (
    <>
      <ListItem disableGutters disablePadding>
        <ListItemButton
          disableGutters
          onClick={() => setOpen((v) => !v)}
          sx={[
            (theme) => ({
              pl: 2, py: 1, gap: 2, pr: 1.5,
              borderRadius: 0.75,
              typography: 'body2',
              fontWeight: 'fontWeightMedium',
              color: theme.vars.palette.text.secondary,
              minHeight: 44,
              ...(isChildActive && {
                fontWeight: 'fontWeightSemiBold',
                color: theme.vars.palette.primary.main,
                bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
              }),
            }),
          ]}
        >
          <Box component="span" sx={{ width: 24, height: 24 }}>{item.icon}</Box>
          <Box component="span" sx={{ flexGrow: 1 }}>{item.title}</Box>
          {item.info && <Box sx={{ mr: 0.5 }}>{item.info}</Box>}
          <Iconify
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            width={16}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: 2 }}>
          {item.children?.map((child) => (
            <NavItemRow key={child.title} item={child} isActive={child.path === pathname} />
          ))}
        </List>
      </Collapse>
    </>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  return (
    <>
      <Logo />
      {slots?.topArea}
      <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />
      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            { display: 'flex', flex: '1 1 auto', flexDirection: 'column' },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box component="ul" sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            {data.map((item) =>
              item.children ? (
                <NavGroupRow key={item.title} item={item} pathname={pathname} />
              ) : (
                <NavItemRow key={item.title} item={item} isActive={item.path === pathname} />
              )
            )}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
      <NavUpgrade />
    </>
  );
}
