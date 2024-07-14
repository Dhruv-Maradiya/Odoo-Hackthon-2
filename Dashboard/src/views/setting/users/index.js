import { Card, CardContent } from '@mui/material'
import AddEditUser from './AddEditUser'
import Header from './Header'
import UsersList from './UsersList'

const Users = ({
  users,
  loading,
  creating,
  updating,
  editData,
  setEditData,
  drawerOpen,
  setDrawerOpen,
  searchValue,
  setSearchValue,
  setPageValue,
  setPageSizeValue,
  pageValue,
  pageSizeValue,
  total,
  setFilterDepartment,
  setFilterJobTitle,
  filterDepartment,
  filterJobTitle,
  openDeleteDialog,
  setOpenDeleteDialog,
  deleteId,
  setDeleteId
}) => {
  const handleDrawerClose = open => () => {
    setDrawerOpen(open)
    setEditData(null)
  }

  return (
    <Card>
      <CardContent>
        <Header
          handleDrawerState={setDrawerOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setFilterDepartment={setFilterDepartment}
          setFilterJobTitle={setFilterJobTitle}
          filterDepartment={filterDepartment}
          filterJobTitle={filterJobTitle}
          loading={creating}
        />
      </CardContent>
      <CardContent>
        <UsersList
          pageValue={pageValue}
          setPageValue={setPageValue}
          pageSizeValue={pageSizeValue}
          setPageSizeValue={setPageSizeValue}
          rows={users}
          loading={loading}
          setDrawerOpen={setDrawerOpen}
          setEditData={setEditData}
          total={total}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
      </CardContent>
      <AddEditUser
        open={drawerOpen}
        onClose={handleDrawerClose(false)}
        editData={editData}
        loading={creating || updating}
      />
    </Card>
  )
}

export default Users
