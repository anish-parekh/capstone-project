import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;

interface SidebarProps {
  selected: string;
  onSelectOption: (option: string) => void;
}

// Animation variants for list items
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function Sidebar({ selected, onSelectOption }: SidebarProps) {
  const options = [
    { id: 'search', label: 'Search', icon: <SearchIcon /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fade-in"
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#222222',
            color: '#ffffff',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.2)'
          },
        }}
      >
        <Toolbar sx={{ backgroundColor: '#1a1a1a', display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Trade Dashboard
          </Typography>
        </Toolbar>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {options.map((option) => (
              <ListItem key={option.id} disablePadding>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%' }}
                >
                  <ListItemButton
                    selected={selected === option.id}
                    onClick={() => onSelectOption(option.id)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#333333',
                        '&:hover': {
                          backgroundColor: '#444444',
                        }
                      },
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#ffffff' }}>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={option.label} 
                      sx={{ 
                        '& .MuiTypography-root': { 
                          color: '#ffffff',
                          fontWeight: selected === option.id ? 'bold' : 'normal' 
                        } 
                      }} 
                    />
                  </ListItemButton>
                </motion.div>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </motion.div>
  );
}
