import React from 'react';
import type { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

/**
 * A reusable styled dialog component for displaying details
 * with consistent styling across the application
 */
const DetailDialog: React.FC<DetailDialogProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#1e293b',
        color: 'white',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        p: 2
      }}>
        <Typography variant="h6">
          {title}
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ color: 'white' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
