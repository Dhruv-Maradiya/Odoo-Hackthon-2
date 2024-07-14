import { Icon } from '@iconify/react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const DeleteDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }} fullWidth>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            '& svg': { mb: 6, color: 'warning.main' }
          }}
        >
          <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
          <Typography>Are you sure you would like to delete?</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onClose} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
