// ** React Imports
import { createContext, useEffect } from 'react'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Next Import
import { useRouter } from 'next/router'

// ** API
import api from 'src/utils/api'

// ** Auth Token
import setAuthToken from 'src/utils/setAuthToken'

// ** Config
import { useDispatch, useSelector } from 'react-redux'
import authConfig from 'src/configs/auth'
import { me, resetStore, setUser as setStoreUser, setUserLoading } from 'src/store/settings/user'
import { HOME, LOGIN } from 'src/navigation/constants'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
  sendResetPasswordLink: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  checkResetPasswordLink: () => Promise.resolve(),
  initAuth: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  // const [user, setUser] = useState(defaultProvider.user)
  const { user: owner, userLoading } = useSelector(state => state.settings)

  const loading = userLoading
  const user = owner

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const setUser = user => {
    const setUserType = setStoreUser
    dispatch(setUserType(user))
  }

  const initAuth = async () => {
    try {
      if (!router.isReady) {
        return
      }

      let storedToken = localStorage.getItem(authConfig.storageTokenKeyName)

      // fetching direct from localStorage because of initial static data at first render
      let localSettings = window.localStorage.getItem('settings')

      if (localSettings) {
        localSettings = JSON.parse(localSettings)
      }

      const { access_token: accessToken, ...query } = router.query

      if (accessToken && !storedToken) {
        storedToken = accessToken
        localStorage.setItem(authConfig.storageTokenKeyName, accessToken)

        router.replace({
          query
        })
      }

      if (storedToken) {
        dispatch(setUserLoading(true))
        setAuthToken(storedToken)
        await handleGetUser()
        dispatch(setUserLoading(false))
      }
    } catch (err) {}
  }

  const handleGetUser = () => {
    return new Promise((resolve, reject) => {
      try {
        dispatch(
          me({
            successCallback: _user => {
              if (router.query.access_token) {
                // remove the access token from the query
                const { access_token, ...query } = router.query

                router.replace({
                  query
                })
              }
              resolve()
            },
            errorCallback: err => {
              if (err.response?.status === 401) {
                handleLogout()
                router.replace(`${LOGIN}?returnUrl=${router.asPath}`)
              }

              reject(err)
            }
          })
        )
      } catch (err) {
        setAuthToken(null)
        router.replace(`${LOGIN}?returnUrl=${router.asPath}`)

        reject(err)
      }
    })
  }

  const handleLogin = async (body, errorCallback, returnUrl) => {
    try {
      const res = await api.post(authConfig.loginEndpoint, body)

      setAuthToken(res.data.data.authToken)

      await handleGetUser()

      router.replace(returnUrl || HOME)
    } catch (err) {
      const errors = err?.response?.data?.message || ''
      errorCallback(errors)
    }
  }

  const handleRegister = async (params, errorCallback) => {
    try {
      await api.post(authConfig.registerEndpoint, params)

      toast.success('Registration successful. Please check your email for verification link.')
    } catch (err) {
      const errors = err.response?.data?.message || ''
      errorCallback(errors)
    }
  }

  const handleLogout = () => {
    setAuthToken(null)

    setUser(null)
    dispatch(resetStore())

    router.replace(LOGIN)
  }

  const handleSendResetPasswordLink = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.sendResetPasswordLinkEndpoint, params)
      toast.success(res.data.data.message)
    } catch (err) {
      const errors = err?.response?.data?.errors || []
      errorCallback(errors)
    }
  }

  const handleResetPassword = async (params, errorCallback) => {
    try {
      const res = await api.post(authConfig.setPasswordLinkEndpoint, params)
      toast.success(res.data.data.message)
    } catch (err) {
      const errors = err.response?.data?.errors
      errorCallback(errors)
    }
  }

  const handleCheckResetPasswordLink = async token => {
    try {
      let res

      res = await api.get(`${authConfig.setPasswordLinkEndpoint}/${token}`)

      return false
    } catch (err) {
      const error = err.response.data.message
      toast.error(error)
    }

    return true
  }

  const values = {
    user,
    loading,
    setUser,
    getUser: handleGetUser,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    sendResetPasswordLink: handleSendResetPasswordLink,
    resetPassword: handleResetPassword,
    checkResetPasswordLink: handleCheckResetPasswordLink,
    initAuth: initAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
