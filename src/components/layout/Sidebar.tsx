import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Define the width of the sidebar
const drawerWidth = 240;

interface SidebarProps {
  selected: string;
  onSelectOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelectOption }) => {
  // Navigation items with their icons
  const navItems = [
    { id: 'search', text: 'Search', icon: <SearchIcon /> },
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'history', text: 'History', icon: <HistoryIcon /> },
    { id: 'saved', text: 'Saved', icon: <BookmarkIcon /> },
    { id: 'settings', text: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#1e293b',
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Trade Dashboard
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selected === item.id}
                onClick={() => onSelectOption(item.id)}
                sx={{
                  position: 'relative',
                  borderRadius: '0 24px 24px 0',
                  marginRight: '8px',
                  marginLeft: '8px',
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(30, 41, 59, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 41, 59, 0.12)',
                    },
                  },
                }}
              >
                {selected === item.id && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    initial={false}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: '#1e293b',
                      borderRadius: '0 4px 4px 0',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <ListItemIcon sx={{ 
                  minWidth: '40px',
                  color: selected === item.id ? '#1e293b' : 'rgba(0, 0, 0, 0.54)'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: selected === item.id ? 600 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
