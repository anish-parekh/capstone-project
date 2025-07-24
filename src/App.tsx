import { useState } from 'react'
import { Box, CssBaseline, Toolbar, createTheme, ThemeProvider } from '@mui/material'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import SearchPage from './components/search/SearchPage'

// Create a theme with enhanced colors and component styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e293b', // Darker blue-gray for primary
      light: '#334155',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b', // Slate color for secondary
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Reduced base font size
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem', // Reduced h6 size
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem', // Smaller button text
    },
  },
  shape: {
    borderRadius: 6, // Reduced border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 500,
          padding: '6px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#1e293b',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: 'rgba(30, 41, 59, 0.04)',
            borderColor: '#0f172a',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: '#1e293b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1e293b',
              boxShadow: '0 0 0 2px rgba(30, 41, 59, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)',
          },
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
        elevation3: {
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 600,
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
  },
});

function App() {
  // Since we only have one option now, we can simplify this
  const [selectedOption, setSelectedOption] = useState('search');
  // Track sidebar width for main content adjustment
  const [sidebarWidth, setSidebarWidth] = useState(200);

  const handleSelectOption = (option: string) => {
    // This will always be 'search', but keeping the handler for potential future expansion
    setSelectedOption(option);
  };
  
  // Function to update sidebar width in App state
  const handleSidebarResize = (width: number) => {
    setSidebarWidth(width);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <Sidebar onSelectOption={handleSelectOption} onWidthChange={handleSidebarResize} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            width: `calc(100% - ${sidebarWidth}px)`, 
            backgroundColor: theme.palette.background.default,
            overflow: 'hidden',
            transition: 'width 0.2s ease-in-out',
          }}
        >
          <Toolbar />
          {selectedOption === 'search' && <SearchPage />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
