import { Icon } from '@iconify/react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ListIcon from '@mui/icons-material/Reorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import WindowIcon from '@mui/icons-material/Window'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CanView from 'src/@core/acl/CanView'
import { useAuth } from 'src/hooks/useAuth'
import useClipboard from 'src/@core/hooks/useClipboard'
import { SURVEYS } from 'src/navigation/constants'
import { surveyStatusColorMapping, surveyStatusLabelMapping } from '../surveys/components/SurveysList'

const Header = ({ view, setView }) => {
  const handleChangeView = (event, nextView) => {
    setView(nextView)
  }

  return (
    <CardContent
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography variant='h5'>Surveys</Typography>

      <ToggleButtonGroup value={view} exclusive onChange={handleChangeView} aria-label='text alignment' size='small'>
        <ToggleButton value='list' aria-label='list'>
          <ListIcon fontSize='small' />
        </ToggleButton>
        <ToggleButton value='grid' aria-label='grid'>
          <WindowIcon fontSize='small' />
        </ToggleButton>
      </ToggleButtonGroup>
    </CardContent>
  )
}

const SurveyList = ({ surveys, handleClick }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {surveys.map(survey => (
        <Card key={survey.id}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Typography variant='h6'>{survey.name}</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                  >
                    <Chip
                      color={surveyStatusColorMapping[survey.status]}
                      label={surveyStatusLabelMapping[survey.status]}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5} md={5}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 5,
                    alignItems: 'center'
                  }}
                >
                  <Tooltip title='Deadline'>
                    <Typography color='error'> {moment(survey.deadline).format('DD/MM/YYYY hh:MM A')}</Typography>
                  </Tooltip>
                  {survey.anonymous ? (
                    <Tooltip title='Anonymous'>
                      <VisibilityOffIcon />
                    </Tooltip>
                  ) : (
                    <Tooltip title='Not Anonymous'>
                      <VisibilityIcon />
                    </Tooltip>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={2} md={1} textAlign={'center'}>
                <CanView
                  acl={{
                    action: 'manage',
                    subject: 'Survey'
                  }}
                  fallback={<RespondButton survey={survey} list={true} />}
                >
                  <IconButton
                    size='small'
                    onClick={e => {
                      handleClick(e, survey)
                    }}
                  >
                    <MoreHorizIcon fontSize='small' />
                  </IconButton>
                </CanView>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

const SurveyGrid = ({ surveys, handleClick }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 2
      }}
    >
      {surveys.map(survey => (
        <Card key={survey.id}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='h5'>{survey.name}</Typography>
            <CanView
              acl={{
                action: 'manage',
                subject: 'Survey'
              }}
              fallback={<RespondButton survey={survey} />}
            >
              <IconButton size='small' onClick={event => handleClick(event, survey)}>
                <MoreHorizIcon fontSize='small' />
              </IconButton>
            </CanView>
          </CardContent>
          <CardContent>
            <Typography>{survey.questionnaire.name}</Typography>
            <Tooltip title='Deadline'>
              <Typography color='error'>{moment(survey.deadline).format('DD/MM/YYYY hh:MM A')}</Typography>
            </Tooltip>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Chip color={surveyStatusColorMapping[survey.status]} label={surveyStatusLabelMapping[survey.status]} />
            </Box>
            {survey.anonymous ? (
              <Tooltip title='Anonymous'>
                <VisibilityOffIcon />
              </Tooltip>
            ) : (
              <Tooltip title='Not Anonymous'>
                <VisibilityIcon />
              </Tooltip>
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  )
}

const DashboardView = ({ surveys, loading, organization }) => {
  const [view, setView] = useState('grid')

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const clipboard = useClipboard()

  const router = useRouter()

  const organizationId = organization?.id

  // const {
  //   user: {
  //     organization: { id: organizationId }
  //   }
  // } = useSelector(state => state.settings)

  const open = Boolean(anchorEl)

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const body = () => {
    if (loading) {
      return (
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </CardContent>
        </Card>
      )
    }

    if (surveys.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>No surveys found</Typography>
          </CardContent>
        </Card>
      )
    }

    if (view === 'grid') {
      return <SurveyGrid surveys={surveys} handleClick={handleClick} />
    } else {
      return <SurveyList surveys={surveys} handleClick={handleClick} />
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <Card>
        <Header view={view} setView={setView} />
      </Card>
      {body()}
      <CanView
        acl={{
          action: 'manage',
          subject: 'Survey'
        }}
      >
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {selectedRow && (
            <Box sx={{ display: 'flex', justifyContent: 'end', flexDirection: 'column' }}>
              <MenuItem
                onClick={() => {
                  router.push(`${SURVEYS}/update/${selectedRow.id}`)
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <Icon icon='tabler:pencil' fontSize={20} />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  window.open(`${SURVEYS}/report/${selectedRow.id}`, '_blank')
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <Icon icon='tabler:graph' fontSize={20} />
                </ListItemIcon>
                <ListItemText>Report</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  try {
                    clipboard.copy(window.location.origin + '/surveys/' + `${organizationId}/${selectedRow.id}`)
                    handleClose()
                    toast.success('Link copied to clipboard!', {
                      position: 'bottom-center'
                    })
                  } catch (err) {
                    toast.error(err?.message)
                  }
                }}
              >
                <ListItemIcon>
                  <Icon icon='tabler:copy' fontSize={20} />
                </ListItemIcon>
                <ListItemText>Copy Survey Link</ListItemText>
              </MenuItem>
            </Box>
          )}
        </Menu>
      </CanView>
    </Box>
  )
}

const RespondButton = ({ survey, list }) => {
  const router = useRouter()

  const {
    user: {
      organization: { id: organizationId }
    }
  } = useAuth()

  return survey._count?.responses === 0 ? (
    list ? (
      <Tooltip title='Fill This Survey Form' arrow>
        <IconButton
          size='small'
          color='primary'
          onClick={() => {
            window.open(window.location.origin + router.asPath + `${organizationId}/${survey.id}`, '_blank')
          }}
        >
          <Icon icon='tabler:clipboard' fontSize={20} />
        </IconButton>
      </Tooltip>
    ) : (
      <Button
        size='small'
        startIcon={<Icon icon='tabler:clipboard' fontSize={20} />}
        onClick={() => {
          router.push(`${SURVEYS}/${organizationId}/${survey.id}`)
        }}
        color='primary'
      >
        Respond
      </Button>
    )
  ) : list ? (
    <Tooltip title='Show' arrow>
      <IconButton
        size='small'
        color='primary'
        onClick={() => window.open(`${SURVEYS}/userResponse/${survey.id}`, '_blank')}
      >
        <Icon icon='tabler:eye' fontSize={20} />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      size='small'
      startIcon={<Icon icon='tabler:eye' fontSize={20} />}
      onClick={() => window.open(`${SURVEYS}/userResponse/${survey.id}`, '_blank')}
      color='primary'
    >
      View
    </Button>
  )
}

export default DashboardView
