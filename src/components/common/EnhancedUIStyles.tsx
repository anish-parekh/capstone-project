import { styled } from '@mui/material/styles';
import { Button, Paper, TextField, Select, Box, TableCell, TableRow, TableHead } from '@mui/material';

// Enhanced Button with better hover effects and modern design
export const EnhancedButton = styled(Button)(() => ({
  borderRadius: '6px',
  padding: '8px 16px',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    clipPath: 'circle(0% at center)',
    transition: 'clip-path 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    '&:before': {
      clipPath: 'circle(100% at center)',
    },
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
  },
}));

// Primary Button with specific styling
export const PrimaryButton = styled(EnhancedButton)(() => ({
  backgroundColor: '#222222',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#444444',
  },
}));

// Secondary Button with specific styling
export const SecondaryButton = styled(EnhancedButton)(() => ({
  backgroundColor: 'transparent',
  color: '#222222',
  border: '1px solid #222222',
  '&:hover': {
    backgroundColor: 'rgba(34, 34, 34, 0.04)',
  },
}));

// Enhanced Paper component with better shadows and border radius
export const EnhancedPaper = styled(Paper)(() => ({
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
  },
}));

// Enhanced Text Field with better focus states
export const EnhancedTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: '#222222',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#222222',
      boxShadow: '0 0 0 3px rgba(34, 34, 34, 0.1)',
    },
  },
}));

// Enhanced Select component
export const EnhancedSelect = styled(Select)(() => ({
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    transition: 'all 0.3s ease',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#222222',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#222222',
    boxShadow: '0 0 0 3px rgba(34, 34, 34, 0.1)',
  },
}));

// Grid Container with better spacing and layout
export const GridContainer = styled(Box)(() => ({
  display: 'grid',
  gap: '16px',
  width: '100%',
  transition: 'all 0.3s ease',
}));

// Enhanced Table Header
export const EnhancedTableHead = styled(TableHead)(() => ({
  backgroundColor: '#222222',
  '& .MuiTableCell-head': {
    color: '#ffffff',
    fontWeight: 600,
    padding: '12px 16px',
  },
}));

// Enhanced Table Cell with better padding and borders
export const EnhancedTableCell = styled(TableCell)(() => ({
  padding: '12px 16px',
  borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
}));

// Enhanced Table Row with better hover effects
export const EnhancedTableRow = styled(TableRow)(() => ({
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}));

// Form Section Container
export const FormSection = styled(Box)(() => ({
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  marginBottom: '16px',
}));
