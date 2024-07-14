import { yupResolver } from '@hookform/resolvers/yup'
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

// ** Icon Imports
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const initialUserData = {
  name: '',
  organizationName: '',
  email: '',
  image: '',
  password: '',
  confirmPassword: ''
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  organizationName: yup.string().required('Organization Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required')
})

const Account = ({ user }) => {
  const [previewImage, setPreviewImage] = useState('')
  const [userErrors, setUserErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [userFormData, setUserFormData] = useState(initialUserData)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loadingUserButton, setLoadingUserButton] = useState(false)
  const inputRef = useRef()
  const router = useRouter()

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    defaultValues: initialUserData,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { user: owner } = useSelector(state => state.settings)
  const { name } = owner || {}

  const handleImageChange = e => {
    const file = e.target.files[0]
    setValue('image', file)
    setPreviewImage(URL.createObjectURL(file))
  }

  const handleUserFormChange = (field, value) => {
    setUserFormData({ ...userFormData, [field]: value })
    setUserErrors({ ...userErrors, [field]: undefined })
  }

  useEffect(() => {
    setValue('name', name)
    setValue('organizationName', user?.organization?.name)
    setValue('email', user?.email)
  }, [name, setValue, user?.email, user?.organization?.name])

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Account</Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='bod2'>Your Personal Information</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' flexDirection={'column'}>
              <FormControl>
                <input
                  hidden
                  type='file'
                  accept='image/*'
                  onChange={e => {
                    if (e.target.files[0]) {
                      handleImageChange(e)
                    }
                  }}
                  ref={inputRef}
                />

                <Badge
                  overlap='circular'
                  badgeContent={<BadgeContentSpan />}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  {/* {isEdit.name ? ( */}
                  <img
                    name='image'
                    style={{ borderRadius: '50%', width: '10rem', height: '10rem', cursor: 'pointer' }}
                    src={previewImage || 'https://via.placeholder.com/1000'}
                    alt='event image'
                    onClick={() => {
                      inputRef.current.click()
                    }}
                  />
                  {/* ) : (
                      <Avatar sx={{ width: '10rem', height: '10rem', fontSize: '100px' }}>{getInitials(name)}</Avatar>
                    )} */}
                </Badge>
              </FormControl>
              {previewImage === '' ? null : (
                <Box alignItems='center'>
                  <Button
                    sx={{ mt: 3 }}
                    variant='text'
                    color='secondary'
                    onClick={() => {
                      setPreviewImage('')
                      setValue('image', '')
                    }}
                  >
                    Remove Profile Image
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}></Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <Controller
                name='organizationName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Organization Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.organizationName)}
                  />
                )}
              />
              {errors.organizationName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.organizationName.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Email Id'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant='body1' sx={{ mt: 4, mb: 4 }}>
          Reset Password
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-password' error={Boolean(userErrors.password)}>
                New Password
              </InputLabel>
              <OutlinedInput
                label='New Password'
                id='new-password'
                onChange={e => handleUserFormChange('password', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                error={Boolean(userErrors.password)}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      fontSize={20}
                    >
                      <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {userErrors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {userErrors.password}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='confirm-password' error={Boolean(userErrors.confirmPassword)}>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                label='Confirm Password'
                id='confirm-password'
                onChange={e => handleUserFormChange('confirmPassword', e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                error={Boolean(userErrors.confirmPassword)}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {userErrors.confirmPassword && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {userErrors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button type='submit' sx={{ mr: 2 }} variant='contained'>
          {loadingUserButton ? (
            <CircularProgress
              sx={{
                color: 'common.white',
                width: '20px !important',
                height: '20px !important',
                mr: theme => theme.spacing(2)
              }}
            />
          ) : null}
          Save Changes
        </Button>
      </CardActions>
    </Card>
  )
}

export default Account
