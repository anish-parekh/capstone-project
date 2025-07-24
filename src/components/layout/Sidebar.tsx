import React, { useState, useRef, useEffect } from 'react';
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
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Define default, minimum and maximum width of the sidebar
const DEFAULT_WIDTH = 200;
const MIN_WIDTH = 60;
const MAX_WIDTH = 400;

interface SidebarProps {
  onSelectOption: (option: string) => void;
  onWidthChange?: (width: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption, onWidthChange }) => {
  // State for sidebar width and collapsed state
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference for the resize handle
  const resizeHandleRef = useRef<HTMLDivElement | null>(null);
  
  // Calculate the current sidebar width based on collapsed state
  const currentWidth = isCollapsed ? MIN_WIDTH : width;
  
  // Handle mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle mouse move during resize
  const handleResizeMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new width based on mouse position
    const newWidth = e.clientX;
    
    // Ensure width is within limits
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setWidth(newWidth);
      
      // Notify parent about width change
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
      
      // If we're collapsed and user drags beyond minimum width, uncollapse
      if (isCollapsed && newWidth > MIN_WIDTH) {
        setIsCollapsed(false);
      }
    }
  };

  // Handle mouse up to end resizing
  const handleResizeEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Handle toggle for collapse/expand
  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    
    // Notify parent about width change
    if (onWidthChange) {
      onWidthChange(newCollapsed ? MIN_WIDTH : width);
    }
  };
  
  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        position: 'relative',
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          overflowX: 'hidden',
          transition: 'width 0.2s ease-in-out',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: '12px',
        backgroundColor: '#1e293b',
        color: 'white',
        minHeight: '56px'
      }}>
        {!isCollapsed && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1rem', flexGrow: 1, textAlign: 'center' }}>
            Trade Dashboard
          </Typography>
        )}
        <Tooltip title={isCollapsed ? 'Expand' : 'Collapse'}>
          <IconButton 
            onClick={toggleCollapse} 
            size="small" 
            sx={{ 
              color: 'white',
              margin: isCollapsed ? '0 auto' : 'inherit',
              display: isCollapsed ? 'flex' : 'inline-flex'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
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
              {!isCollapsed && (
                <ListItemText 
                  primary="Trade Search" 
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        {!isCollapsed && (
          <Box sx={{ p: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
              Version 1.0.0
            </Typography>
          </Box>
        )}
        
        {/* Resize handle */}
        <Box
          ref={resizeHandleRef}
          onMouseDown={handleResizeStart}
          sx={{
            position: 'absolute',
            top: 0,
            right: -3,
            width: 6,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1200,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 2,
              height: 40,
              width: 2,
              backgroundColor: isDragging ? '#1976d2' : 'rgba(0, 0, 0, 0.2)',
              display: isCollapsed ? 'none' : 'block',
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
