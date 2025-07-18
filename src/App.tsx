import { useState } from 'react'
import { Box, CssBaseline, Toolbar, createTheme, ThemeProvider } from '@mui/material'
import './App.css'
import Sidebar from './components/Sidebar'
import SearchPage from './components/SearchPage'

// Create a theme with black and grey colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#222222',
      light: '#444444',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#666666',
      light: '#e0e0e0',
      dark: '#444444',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#222222',
          color: '#222222',
          '&:hover': {
            backgroundColor: 'rgba(34, 34, 34, 0.04)',
            borderColor: '#000000',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#222222',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#222222',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '& .MuiTableCell-head': {
            color: '#333333',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

function App() {
  const [selectedOption, setSelectedOption] = useState('search')

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <Sidebar selected={selectedOption} onSelectOption={handleSelectOption} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: 'calc(100% - 240px)', 
            backgroundColor: theme.palette.background.default,
            overflow: 'hidden'
          }}
        >
          <Toolbar />
          {selectedOption === 'search' && <SearchPage />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
