// ** React Imports
import { useCallback, useEffect, useRef, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import MuiAutocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import MuiDialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Imports
import themeConfig from 'src/configs/themeConfig'
import Avatar from '@mui/material/Avatar'

const categoryTitle = {
  dashboards: 'Dashboards',
  appsPages: 'Apps & Pages',
  userInterface: 'User Interface',
  formsTables: 'Forms & Tables',
  chartsMisc: 'Charts & Misc'
}

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const NoResult = ({ value, setOpenDialog }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <Icon icon='tabler:file-off' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No results for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>
    </Box>
  )
}

const AutocompleteComponent = ({ hidden, settings }) => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [options, setOptions] = useState([])

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const { layout } = settings
  const wrapper = useRef(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  const { user } = useSelector(state => state.settings)

  const students = user?.student || []

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  const handleSearchChange = value => {
    setSearchValue(value)

    const relatedStudents = students.filter(student => {
      const name = `${student.firstname} ${student.lastname}`

      return name.toLowerCase().includes(value.toLowerCase()) && student.isDeleted !== true
    })

    setOptions(relatedStudents)
  }

  // Handle click event on a list item in search result
  const handleOptionClick = obj => {
    setSearchValue('')
    setOpenDialog(false)
    if (obj) {
      router.push(`/contacts/view/?id=${obj._id}`)
    }
  }

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    event => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    event => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 0.5, ml: -2.75 } : {}}>
          <Icon fontSize='1.5rem' icon='tabler:search' />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>Search (Ctrl+/)</Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
              <Autocomplete
                autoHighlight
                disablePortal
                options={options}
                id='appBar-search'
                isOptionEqualToValue={(option, value) => option._id === value}
                onInputChange={(event, value) => handleSearchChange(value)}
                onChange={(event, obj) => handleOptionClick(obj)}
                noOptionsText={<NoResult value={searchValue} setOpenDialog={setOpenDialog} />}
                getOptionLabel={option => option.firstname + ' ' + option.lastname}
                sx={{
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                          overflow: 'auto',
                          maxHeight: 'calc(100vh - 69px)',
                          borderTop: `1px solid ${theme.palette.divider}`,
                          height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                          '& .MuiListSubheader-root': { p: theme.spacing(3.75, 6, 0.75) }
                        }
                      : {
                          '& .MuiAutocomplete-listbox': { pb: 0 }
                        })
                  }
                }}
                renderInput={params => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={event => setSearchValue(event.target.value)}
                      inputRef={input => {
                        if (input) {
                          if (openDialog) {
                            input.focus()
                          } else {
                            input.blur()
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { p: `${theme.spacing(3.75, 6)} !important`, '&.Mui-focused': { boxShadow: 0 } },
                        startAdornment: (
                          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                            <Icon fontSize='1.5rem' icon='tabler:search' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            onClick={() => setOpenDialog(false)}
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                          >
                            {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                            <IconButton size='small' sx={{ p: 1 }}>
                              <Icon icon='tabler:x' fontSize='1.25rem' />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
                renderOption={(props, option) => {
                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={option._id}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option)}
                      secondaryAction={<Icon icon='tabler:corner-down-left' fontSize='1.25rem' />}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled'
                          }
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2.5
                        }}
                      >
                        <Avatar src={option?.avatar?.url} alt={option.firstname + ' ' + option.lastname} />
                        <Typography variant='body2' sx={{ color: 'text.primary', ml: 3 }}>
                          {option.firstname + ' ' + option.lastname}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }}
              />
            </Box>
          </Dialog>
        )}
      </Box>
    )
  }
}

export default AutocompleteComponent
