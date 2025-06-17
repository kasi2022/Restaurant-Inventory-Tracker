import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useNavigate, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, route: '/dashbord' },
  { text: 'AddItems', icon: <AnalyticsRoundedIcon />, route: '/add-products' },
  { text: 'Consumer', icon: <AnalyticsRoundedIcon />, route: '/consumerpage' },

];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, route: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, route: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, route: '/feedback' },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation(); // 🧭 current path

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={location.pathname === item.route} // ✅ match current path
              sx={{
                borderRadius: 2,
                bgcolor: location.pathname === item.route ? '#e0f7fa' : 'transparent', // light highlight
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={location.pathname === item.route}
              sx={{
                borderRadius: 2,
                bgcolor: location.pathname === item.route ? '#e0f7fa' : 'transparent',
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
