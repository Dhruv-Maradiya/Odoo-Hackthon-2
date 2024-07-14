// ** Next Import
import Link from 'next/link'
import Img from 'next/image'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: '24px',
  fontSize: '1.275rem !important',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { mode, navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 15) / 8
      }
    } else {
      return 4.5
    }
  }

  const conditionalColors = () => {
    if (mode === 'semi-dark') {
      return {
        '& .MuiTypography-root, & .MuiIconButton-root': {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`
        }
      }
    } else {
      return {
        '& .MuiTypography-root, & .MuiIconButton-root': {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`
        }
      }
    }
  }
  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='tabler:circle-dot' />
  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='tabler:circle' />

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft(), ...conditionalColors() }}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href='/'>
          {/* <svg width='30' height='20' viewBox='0 0 440 365' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M34.5 71.5L3 0C207.8 66.8 379.333 27.8333 439.5 0C319.5 91.2 119.5 85.6667 34.5 71.5Z'
              fill='#00AEF0'
            />
            <path
              d='M405.464 109.581L437 163.5C231.965 113.125 60.2356 142.511 0 163.5C120.137 94.7251 320.367 98.8979 405.464 109.581Z'
              fill='#00AEF0'
            />
            <path
              d='M114.598 337.377L49 348.657C127.119 223.954 109.482 107.26 90.898 64.5002C159.194 154.387 135.155 283.871 114.598 337.377Z'
              fill='#00AEF0'
            />
            <path
              d='M298.932 332.377L364.529 343.657C286.41 218.954 304.048 102.26 322.631 59.5002C254.335 149.387 278.375 278.871 298.932 332.377Z'
              fill='#00AEF0'
            />
            <path d='M25 365C67.25 354.435 204.4 339.645 415 365H25Z' fill='#00AEF0' />
          </svg> */}
          <Img src='/Review-Genie-Logo.png' alt='logo' width={32} height={22} />
          <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2.5 }) }}>
            {themeConfig.appName}
          </HeaderTitle>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            backgroundColor: 'transparent !important',
            color: `${
              mode === 'semi-dark' ? `rbga(${theme.palette.customColors.dark}, 0.6)` : theme.palette.text.secondary
            } !important`
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{
            p: 0,
            backgroundColor: 'transparent !important',
            '& svg': {
              fontSize: '1.25rem',
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out'
            }
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
