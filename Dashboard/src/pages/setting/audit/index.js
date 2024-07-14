import {
  Card,
  CardContent,
  CardHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAudit } from 'src/store/settings/user'

const AuditPage = () => {
  const dispatch = useDispatch()

  const { logs } = useSelector(state => state.settings)

  useEffect(() => {
    dispatch(getAudit())
  }, [dispatch])

  return (
    <Card>
      <CardHeader title='Audit Logs' />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.user.email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{moment(log.createdAt).format('DD/MM/YYYY')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default AuditPage
