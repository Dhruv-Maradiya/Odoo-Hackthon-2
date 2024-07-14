// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import toast from 'react-hot-toast'
import { LOGIN } from 'src/navigation/constants'

// ** Styled Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
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
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  newPassword: yup.string().min(8).required(),
  confirmNewPassword: yup.string().min(8).required()
})

const defaultValues = {
  newPassword: '',
  confirmNewPassword: ''
}

const ResetPassword = () => {
  // ** States
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [newToken, setNewToken] = useState('')
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const { checkResetPasswordLink, resetPassword } = useAuth()

  // ** Router
  const router = useRouter()
  const { token } = router.query

  useEffect(() => {
    const setToken = async () => {
      if (token) {
        setNewToken(token)
        const isExpired = await checkResetPasswordLink(token)
        setIsExpired(isExpired)
      }
    }
    setToken()
  }, [token, checkResetPasswordLink])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const onSubmit = async data => {
    const { newPassword, confirmNewPassword } = data
    if (newPassword !== confirmNewPassword) {
      setError('confirmNewPassword', {
        type: 'manual',
        message: 'Password must be matched'
      })

      return
    }
    setLoading(true)
    await resetPassword({ password: newPassword, token: newToken }, errors => {
      if (Array.isArray(errors)) {
        errors.forEach(err => {
          toast.error(err)
        })
      } else {
        toast.error(errors)
      }
    })

    router.replace(`${LOGIN}`)
    setLoading(false)
  }

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
          <ResetPasswordIllustration alt='reset-password-illustration' src='/login.png' />
          {/* <ResetPasswordIllustration
            alt='reset-password-illustration'
            src={`/images/pages/auth-illustration-${theme.palette.mode}.png`}
          /> */}
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
          {isExpired ? (
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Box sx={{ my: 6 }}>
                <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                  Oops! 😖 Your reset password link has expired or is invalid!
                </Typography>
              </Box>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href={LOGIN}>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Box sx={{ my: 6 }}>
                <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                  Reset Password 🔒
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <InputLabel htmlFor='auth-new-password' error={Boolean(errors.newPassword)}>
                    New Password
                  </InputLabel>
                  <Controller
                    name='newPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='New Password'
                        onChange={onChange}
                        id='auth-new-password'
                        error={Boolean(errors.newPassword)}
                        type={showNewPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              <Icon icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.newPassword && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.newPassword.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 1.5 }}>
                  <InputLabel htmlFor='auth-confirm-new--password' error={Boolean(errors.confirmNewPassword)}>
                    Confirm Password
                  </InputLabel>
                  <Controller
                    name='confirmNewPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Confirm Password'
                        onChange={onChange}
                        id='auth-confirm-new-password'
                        error={Boolean(errors.confirmNewPassword)}
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            >
                              <Icon icon={showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.confirmNewPassword && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.confirmNewPassword.message}
                    </FormHelperText>
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
                  Set New Password
                </Button>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                >
                  <LinkStyled href={LOGIN}>
                    <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                    <span>Back to login</span>
                  </LinkStyled>
                </Typography>
              </form>
            </Box>
          )}
        </Box>
      </RightWrapper>
    </Box>
  )
}
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
