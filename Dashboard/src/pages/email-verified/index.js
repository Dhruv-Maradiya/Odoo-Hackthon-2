import { Icon } from '@iconify/react'
import { Button, Card, CardContent, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { LOGIN } from 'src/navigation/constants'

const Verification = () => {
  const theme = useTheme()
  const router = useRouter()

  return (
    <Container className='content-center'>
      <Card sx={{ px: 20 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Icon icon='mdi:check' fontSize='5rem' style={{ color: theme.palette.success.main }} />
          <Typography textAlign='center' variant='h5'>
            Your email has been verified successful.
          </Typography>
          <Button
            variant='contained'
            onClick={() => {
              router.push(`${LOGIN}`)
            }}
            sx={{ mt: 5 }}
          >
            Go To Log In
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}

Verification.getLayout = page => <BlankLayout>{page}</BlankLayout>
Verification.guestGuard = true

export default Verification
