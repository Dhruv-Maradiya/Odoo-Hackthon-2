// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { HOME } from 'src/navigation/constants'

const WindowWrapper = ({ children }) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState(false)
  const router = useRouter()

  const { logout, initAuth } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowReadyFlag(true)

      // Window Event Listeners
      window.addEventListener('storage', e => {
        if (e.key === 'token') {
          if (!e.newValue) {
            logout()
          } else if (e.newValue !== e.oldValue) {
            initAuth()

            if (router.route === '/login') {
              router.replace(router.query.returnUrl || HOME)
            }
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])
  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return null
  }
}

export default WindowWrapper
