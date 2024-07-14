import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'
import React from 'react'
import SearchField from 'src/@core/components/search'

const Header = ({ handleDrawerState, searchValue, setSearchValue }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            handleDrawerState(true)
          }}
        >
          Create Exam
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
        <SearchField
          placeholder='Search Users...'
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value)
          }}
        />
      </Box>
    </Box>
  )
}

export default Header
