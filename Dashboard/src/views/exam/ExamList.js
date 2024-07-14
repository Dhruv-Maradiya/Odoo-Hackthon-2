import { Icon } from '@iconify/react'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Delete from './Delete'
import { useCallback } from 'react'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/router'

const RowOptions = ({ row, setEditData, setDrawerOpen, setDeleteId, setOpenDeleteDialog }) => {
  const { user } = useAuth()

  if (row.owner || (row?.createdBy?.id !== user.id && !user.owner)) return null

  return (
    <>
      <Tooltip title='Edit' arrow>
        <IconButton
          size='small'
          onClick={() => {
            setEditData(row)
            setDrawerOpen(true)
          }}
        >
          <Icon icon='tabler:pencil' fontSize={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title='Delete' arrow>
        <IconButton
          size='small'
          onClick={() => {
            setDeleteId(row.id), setOpenDeleteDialog(true)
          }}
        >
          <Icon icon='tabler:trash' fontSize={20} />
        </IconButton>
      </Tooltip>
    </>
  )
}

const ExamList = ({
  pageValue,
  setPageValue,
  pageSizeValue,
  setPageSizeValue,
  rows,
  loading,
  setDrawerOpen,
  setEditData,
  total,
  openDeleteDialog,
  setOpenDeleteDialog,
  deleteId,
  setDeleteId
}) => {
  const router = useRouter()

  const getColumns = useCallback(() => {
    return [
      {
        field: 'name',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        flex: 1,
        minWidth: 160,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href={`/exams/${row.id}`}>
              <Typography variant='subtitle1'>{row.name}</Typography>
            </Link>
          </Box>
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => {
          const iconColor = row.status === 'ONGOING' ? 'success' : 'error'

          return <Chip color={iconColor} label={row.status} />
        },
        flex: 1,
        minWidth: 100
      },
      {
        field: 'startAt',
        headerName: 'Starts At',
        renderCell: ({ row }) => {
          return moment(row.startAt).format('DD/MM/YYYY hh:mm A')
        },
        flex: 1,
        minWidth: 100
      },
      {
        field: 'endsAt',
        headerName: 'Ends At',
        renderCell: ({ row }) => {
          return moment(row.endAt).format('DD/MM/YYYY hh:mm A')
        },
        flex: 1,
        minWidth: 100
      },
      {
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => (
          <RowOptions
            row={row}
            setEditData={setEditData}
            setDrawerOpen={setDrawerOpen}
            setDeleteId={setDeleteId}
            setOpenDeleteDialog={setOpenDeleteDialog}
          />
        ),
        flex: 1,
        minWidth: 100
      }
    ]
  }, [setDeleteId, setDrawerOpen, setEditData, setOpenDeleteDialog])

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={getColumns()}
        loading={loading}
        rowCount={total}
        page={pageValue}
        onPageChange={newPage => setPageValue(newPage)}
        pageSize={pageSizeValue}
        onPageSizeChange={newPageSize => setPageSizeValue(newPageSize)}
        filterMode='server'
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
        isRowSelectable={row => false}
      />
      <Delete open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} deleteId={deleteId} />
    </Box>
  )
}

export default ExamList
