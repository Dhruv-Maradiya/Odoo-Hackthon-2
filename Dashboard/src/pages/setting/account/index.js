import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Account from 'src/views/setting/account'

const AccountView = () => {
  const { user } = useAuth()

  return (
    <>
      <Account user={user} />
    </>
  )
}

export default AccountView
