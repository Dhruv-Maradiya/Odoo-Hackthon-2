import { parseAsArrayOf, parseAsInteger, parseAsString } from 'next-usequerystate'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDebounce from 'src/hooks/useDebounce'
import useLocalizedQueryState from 'src/hooks/useQueryState'
import { fetchUsers, setDrawerOpen, setEditData } from 'src/store/settings/user'
import Users from 'src/views/setting/users'

const UserView = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const useCustomQueryState = useLocalizedQueryState({
    prefix: 'ul',
    defaultValues: {
      search: '',
      page: 0,
      pageSize: 25
    }
  })

  const [searchValue, setSearchValue] = useCustomQueryState({
    key: 'search',
    parser: parseAsString
  })

  const [pageValue, setPageValue] = useCustomQueryState({
    key: 'page',
    parser: parseAsInteger
  })

  const [pageSizeValue, setPageSizeValue] = useCustomQueryState({
    key: 'pageSize',
    parser: parseAsInteger
  })

  const searchDebounce = useDebounce(searchValue, 500)

  const dispatch = useDispatch()

  const {
    users: { data: users, loading, creating, updating, editData, drawerOpen, total }
  } = useSelector(state => state.settings)

  const handleSetEditData = data => {
    dispatch(setEditData(data))
  }

  const handleSetDrawerOpen = open => {
    dispatch(setDrawerOpen(open))
  }

  useEffect(() => {
    dispatch(
      fetchUsers({
        search: searchDebounce,
        page: pageValue,
        pageSize: pageSizeValue
      })
    )
  }, [dispatch, pageSizeValue, pageValue, searchDebounce])

  return (
    <Users
      users={users}
      loading={loading}
      creating={creating}
      updating={updating}
      editData={editData}
      setEditData={handleSetEditData}
      setDrawerOpen={handleSetDrawerOpen}
      drawerOpen={drawerOpen}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      pageValue={pageValue}
      setPageValue={setPageValue}
      pageSizeValue={pageSizeValue}
      setPageSizeValue={setPageSizeValue}
      total={total}
      openDeleteDialog={openDeleteDialog}
      setOpenDeleteDialog={setOpenDeleteDialog}
      deleteId={deleteId}
      setDeleteId={setDeleteId}
    />
  )
}

UserView.acl = {
  action: ['read', 'create', 'update', 'delete'],
  subject: 'Settings/User'
}

export default UserView
