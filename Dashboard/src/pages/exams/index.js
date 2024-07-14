import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExams } from 'src/store/exam/exam'
import { fetchUsers } from 'src/store/settings/user'
import ExamsView from 'src/views/exam'

const ExamPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()

  const { data, total } = useSelector(state => state.exam)

  useEffect(() => {
    dispatch(
      fetchExams({
        page: page,
        pageSize: rowsPerPage,
        search
      })
    )
    dispatch(fetchUsers())
  }, [dispatch, page, rowsPerPage, search])

  return (
    <ExamsView
      exams={data}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      search={search}
      setSearch={setSearch}
      total={total}
    />
  )
}

ExamPage.acl = {
  action: 'manage',
  subject: 'Exam'
}

export default ExamPage
