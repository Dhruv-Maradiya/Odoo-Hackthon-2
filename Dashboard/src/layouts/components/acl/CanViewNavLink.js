// ** React Imports
import { useContext } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavLink = props => {
  // ** Props
  const { children, navLink } = props
  const { settings } = useSettings()

  // ** Hook
  const ability = useContext(AbilityContext)


  return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null
}

export default CanViewNavLink
