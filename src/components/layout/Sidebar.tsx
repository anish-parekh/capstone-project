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
  Search as SearchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Define the width of the sidebar
const drawerWidth = 200;

interface SidebarProps {
  selected: string;
  onSelectOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelectOption }) => {
  // Navigation items with their icons - simplified to only search
  const navItems = [
    { id: 'search', text: 'Trade Search', icon: <SearchIcon /> }
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
        padding: '12px',
        backgroundColor: '#1e293b',
        color: 'white',
        minHeight: '56px'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          Trade Dashboard
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List sx={{ pt: 1.5 }}>
          {/* Single option - always selected */}
          <ListItem disablePadding>
            <ListItemButton
              selected={true}
              onClick={() => onSelectOption('search')}
              sx={{
                position: 'relative',
                borderRadius: '0 20px 20px 0',
                marginRight: '6px',
                marginLeft: '6px',
                mb: 0.5,
                py: 0.8,
                backgroundColor: 'rgba(30, 41, 59, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(30, 41, 59, 0.12)',
                },
              }}
            >
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
              <ListItemIcon sx={{ 
                minWidth: '36px',
                color: '#1e293b',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.3rem'
                }
              }}>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Trade Search" 
                primaryTypographyProps={{ 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
