import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { unwrapResult } from '@reduxjs/toolkit'
import moment from 'moment'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createExam, updateExam } from 'src/store/exam/exam'
import * as yup from 'yup'

const defaultValues = {
  name: '',
  description: '',
  status: '',
  startDate: null,
  endDate: null,
  invigilators: []
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.date().required('Start Date is required').typeError('Start Date is required'),
  endDate: yup.date().required('End Date is required').typeError('End Date is required'),
  invigilators: yup.array(yup.string().required()).required('Invigilators are required')
})

const AddEditExam = ({ open, onClose, editData, loading, setEditData }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch()

  const {
    users: { data: users }
  } = useSelector(state => state.settings)

  const submit = async data => {
    try {
      if (editData) {
        const res = await dispatch(
          updateExam({
            id: editData.id,
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            invigilators: data.invigilators
          })
        )
        unwrapResult(res)

        toast.success('User updated successfully!')
      } else {
        const res = await dispatch(
          createExam({
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            invigilators: data.invigilators
          })
        )
        unwrapResult(res)

        toast.success('User created successfully!')
      }
      reset()
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
    setEditData(null)
  }

  useEffect(() => {
    if (editData) {
      setValue('name', editData.name)
      setValue('description', editData.description)
      setValue('status', editData.status)
      setValue('startDate', moment(editData.startAt))
      setValue('endDate', moment(editData.endAt))
      setValue(
        'invigilators',
        editData.invigilators.map(invigilator => invigilator.user.id)
      )
    }
  }, [editData, setValue])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 300, sm: 600 }
        }
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            gap: 3
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Typography variant='h6'>{editData ? 'Edit' : 'Add'} Exam</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              p={5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              <Box>
                <Typography graphy variant='h6' color='text.primary' fontWeight='600'>
                  Exam Information
                </Typography>
                <Grid container spacing={3} p={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            size='small'
                            label='Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='description'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            size='small'
                            label='Description'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.description)}
                          />
                        )}
                      />
                      {errors.description && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {/* Status */}
                  <Grid item xs={12}>
                    <FormControl fullWidth size='small' error={Boolean(errors.status)}>
                      <InputLabel id='demo-simple-select-label'>Status</InputLabel>
                      <Controller
                        name='status'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            size='small'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.status)}
                            label='Status'
                            renderInput={params => <TextField {...params} error={Boolean(errors.role)} label='Role' />}
                          >
                            <MenuItem value='ONGOING'>Ongoing</MenuItem>
                            <MenuItem value='ARCHIVED'>Archived</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant='h6' color='text.primary' fontWeight='600'>
                  Exam Dates
                </Typography>
                <Grid container spacing={3} p={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth error={Boolean(errors.startDate)}>
                      <Controller
                        name='startDate'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <LocalizationProvider
                            renderInput={params => <TextField {...params} />}
                            dateAdapter={AdapterDayjs}
                          >
                            <DatePicker
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              label='Start Date'
                              slotProps={{ textField: { size: 'small', error: Boolean(errors.startDate) } }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.startDate && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.startDate.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth error={Boolean(errors.endDate)}>
                      <Controller
                        name='endDate'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            renderInput={params => <TextField {...params} />}
                          >
                            <DatePicker
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              label='End Date'
                              minDate={watch('startDate')}
                              slotProps={{ textField: { size: 'small', error: Boolean(errors.endDate) } }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.endDate && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.endDate.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant='h6' color='text.primary' fontWeight='600'>
                  Invigilators
                </Typography>
                <Grid container spacing={3} p={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-multiple-chip-label'>Invigilators</InputLabel>
                      <Controller
                        name='invigilators'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            multiple
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.invigilators)}
                            renderValue={selected => {
                              return (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5
                                  }}
                                >
                                  {selected.map(value => {
                                    const user = users.find(user => user.id === value)

                                    return <Chip key={value} label={user?.name || ''} />
                                  })}
                                </Box>
                              )
                            }}
                            label='Invigilators'
                            renderInput={params => (
                              <TextField {...params} error={Boolean(errors.invigilators)} label='Invigilators' />
                            )}
                          >
                            {users &&
                              users.map(user => (
                                <MenuItem key={user.id} value={user.id}>
                                  {user.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      {errors.invigilators && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.invigilators.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Button variant='text' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' disabled={loading} type='submit'>
              {loading ? (
                <CircularProgress
                  size={20}
                  sx={{
                    mr: 2,
                    color: 'common.white'
                  }}
                />
              ) : null}
              {editData ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  )
}

export default AddEditExam
