// ** React Imports
import { Fragment, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Demo Imports
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { LOGIN } from 'src/navigation/constants'

const defaultValues = {
  email: '',
  name: '',
  password: '',
  organizationName: '',
  terms: false
}

const schema = yup.object().shape({
  password: yup.string().min(8).required(),
  name: yup.string().min(3).required(),
  email: yup.string().email().required(),
  organizationName: yup.string().min(3).required(),
  terms: yup.bool().oneOf([true], 'You must accept the privacy policy & terms')
})

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { register } = useAuth()
  const router = useRouter()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    const { email, name, password, organizationName } = data
    setLoading(true)
    await register({ email, name, password, organizationName }, error => {
      if (Array.isArray(error)) {
        error.forEach(err => {
          toast.error(err)
        })
      } else {
        toast.error(error)
      }
    })
    setLoading(false)
  }


  const azureRegister = () => {
    router.replace(`${process.env.BACKEND_API_URL}/v2/auth/microsoft`)
  }

  const googleRegister = () => {
    router.replace(`${process.env.BACKEND_API_URL}/v2/auth/google`)
  }

  // const imageSource = skin === 'bordered' ? 'auth-illustration-bordered' : 'auth-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={'/login.png'}

            // src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                Adventure starts here 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Make your account management easy and fun!</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      label='Full Name'
                      onChange={onChange}
                      placeholder='John Doe'
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='user@email.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='organizationName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label='Organization'
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
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      label='Password'
                      onBlur={onBlur}
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={Boolean(errors.terms)}>
                <Controller
                  name='terms'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FormControlLabel
                        sx={{
                          ...(errors.terms ? { color: 'error.main' } : null),
                          '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                        }}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={onChange}
                            sx={errors.terms ? { color: 'error.main' } : null}
                          />
                        }
                        label={
                          <Fragment>
                            <Typography
                              variant='body2'
                              component='span'
                              sx={{ color: errors.terms ? 'error.main' : '' }}
                            >
                              I agree to{' '}
                            </Typography>
                            <LinkStyled href='/' onClick={e => e.preventDefault()}>
                              privacy policy & terms
                            </LinkStyled>
                          </Fragment>
                        }
                      />
                    )
                  }}
                />
                {errors.terms && (
                  <FormHelperText sx={{ mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>
                )}
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Sign up
              </Button>
              <Button
                fullWidth
                size='large'
                variant='contained'
                padding='normal'
                sx={{
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'left',
                  '&.MuiButtonBase-root': {
                    p: 0.7
                  }
                }}
                onClick={googleRegister}
              >
                <img
                  src='/images/logos/Google-Logo.jpeg'
                  style={{ borderRadius: '10%' }}
                  alt='Google Logo'
                  width={40}
                />
                <Box sx={{ width: '100%' }}>Sign up with Google</Box>
              </Button>
              <Button
                fullWidth
                size='large'
                variant='contained'
                padding='normal'
                onClick={azureRegister}
                sx={{
                  mb: 4,

                  display: 'flex',
                  justifyContent: 'left',
                  '&.MuiButtonBase-root': {
                    p: 0.7
                  }
                }}
              >
                <img
                  src='/images/logos/Microsoft_logo.svg.png'
                  style={{ borderRadius: '10%' }}
                  alt='Microsoft Logo'
                  width={40}
                />
                <Box sx={{ width: '100%' }}>Sign up with Microsoft</Box>
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography variant='body2'>
                  <LinkStyled href={LOGIN} sx={{ fontSize: '1rem' }}>
                    Sign in instead
                  </LinkStyled>
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
