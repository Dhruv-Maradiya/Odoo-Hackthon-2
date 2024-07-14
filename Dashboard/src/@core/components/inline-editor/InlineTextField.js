import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const InlineTextField = ({
  collapseOpen,
  setCollapseOpen,
  textFieldProps = {},
  typographyProps = {},
  text,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditedText(text)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (text.toString() !== editedText.toString()) {
      onChange(editedText)
    }
    setEditedText('')
  }

  const handleChange = e => {
    setEditedText(e.target.value)
  }

  return (
    <div>
      {isEditing ? (
        <TextField
          variant='standard'
          InputProps={{
            disableUnderline: true
          }}
          sx={{
            '& .MuiInputBase-input': {
              width: `${(editedText.length || 1) * 11}px`
            }
          }}
          {...textFieldProps}
          value={editedText}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            {...typographyProps}
            sx={{
              cursor: 'pointer'
            }}
            onDoubleClick={handleDoubleClick}
          >
            {text}
          </Typography>
          <IconButton onClick={() => setCollapseOpen(!collapseOpen)}>
            {collapseOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      )}
    </div>
  )
}

export default InlineTextField
