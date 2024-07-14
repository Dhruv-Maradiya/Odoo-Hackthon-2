import { Card, CardContent } from '@mui/material'
import Header from './Header'
import { useState } from 'react'
import ExamList from './ExamList'
import AddEditExam from './AddEditExam'

const ExamsView = ({ exams, page, setPage, rowsPerPage, setRowsPerPage, search, setSearch, loading, total }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  return (
    <Card>
      <CardContent>
        <Header handleDrawerState={setDrawerOpen} searchValue={search} setSearchValue={setSearch} />
      </CardContent>
      <CardContent>
        <ExamList
          pageValue={page}
          setPageValue={setPage}
          pageSizeValue={rowsPerPage}
          setPageSizeValue={setRowsPerPage}
          rows={exams}
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
      <AddEditExam
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editData={editData}
        setEditData={setEditData}
      />
    </Card>
  )
}

export default ExamsView
