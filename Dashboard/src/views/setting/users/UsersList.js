import { Icon } from '@iconify/react'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import moment from 'moment'
import { useCallback, useState } from 'react'
import Delete from './Delete'
import { useAuth } from 'src/hooks/useAuth'

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

const UsersList = ({
  rows,
  loading,
  setEditData,
  setDrawerOpen,
  pageValue,
  setPageValue,
  pageSizeValue,
  setPageSizeValue,
  total,
  openDeleteDialog,
  setOpenDeleteDialog,
  deleteId,
  setDeleteId
}) => {
  const getColumns = useCallback(() => {
    return [
      { field: 'id', headerName: 'ID', flex: 1, minWidth: 60 },
      {
        field: 'name',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        flex: 1,
        minWidth: 160,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='subtitle1'>{row.name}</Typography>
            {row.owner && <Chip size='small' label='Owner' color='default' />}
          </Box>
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => {
          const iconColor = row.enabled ? 'success' : 'error'

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: `${iconColor}.main`,
                  color: `${iconColor}.contrastText`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon icon='tabler:check' width={18} height={18} />
              </Box>
              <Typography variant='body2'>{row.enabled ? 'Enabled' : 'Disabled'}</Typography>
            </Box>
          )
        },
        flex: 1,
        minWidth: 100
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        renderCell: ({ row }) => {
          return moment(row.createdAt).format('DD/MM/YYYY hh:mm A')
        },
        flex: 1,
        minWidth: 100
      },
      {
        field: 'role',
        headerName: 'Role',
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
        disableColumnMenu
      />
      <Delete open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} deleteId={deleteId} />
    </Box>
  )
}

export default UsersList
