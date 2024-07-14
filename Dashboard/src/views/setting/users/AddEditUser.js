import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createUser, updateUser } from 'src/store/settings/user'
import * as yup from 'yup'

const defaultValues = {
  name: '',
  email: '',
  role: '',
  enabled: true
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  role: yup.string().required('Role is required'),
  enabled: yup.boolean()
})

const AddEditUser = ({ open, onClose, editData, loading }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch()

  const submit = async data => {
    try {
      if (editData) {
        const res = await dispatch(
          updateUser({
            id: editData.id,
            name: data.name,
            role: data.role,
            enabled: data.enabled
          })
        )
        unwrapResult(res)

        toast.success('User updated successfully!')
      } else {
        const res = await dispatch(
          createUser({
            name: data.name,
            email: data.email,
            role: data.role,
            enabled: data.enabled
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
  }

  useEffect(() => {
    if (editData) {
      setValue('name', editData.name)
      setValue('email', editData.email)
      setValue('role', editData.role)
      setValue('enabled', editData.enabled)
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
              <Typography variant='h6'>{editData ? 'Edit' : 'Add'} User</Typography>
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
                <Typography variant='h6' color='text.primary' fontWeight='600'>
                  Personal Information
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
                        name='email'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            size='small'
                            label='Email Id'
                            disabled={editData}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.email)}
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <Controller
                        name='enabled'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={<Switch checked={value} onChange={e => onChange(e.target.checked)} />}
                            label='Enable login?'
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant='h6' color='text.primary' fontWeight='600'>
                  Access Information
                </Typography>
                <Box p={2}>
                  <FormControl fullWidth>
                    <Controller
                      name='role'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Select
                          size='small'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          renderInput={params => <TextField {...params} error={Boolean(errors.role)} label='Role' />}
                        >
                          <MenuItem value='ADMIN'>Admin</MenuItem>
                          <MenuItem value='EXAMINER'>Examiner</MenuItem>
                          <MenuItem value='INVIGILATOR'>Invigilator</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>}
                  </FormControl>
                </Box>
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

export default AddEditUser
