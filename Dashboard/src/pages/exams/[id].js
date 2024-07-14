import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExamPaper } from 'src/store/exam-paper/exam-paper'
import { fetchExamById } from 'src/store/exam/exam'
import ExamSingleView from 'src/views/exam/ExamSingleView'
import * as yup from 'yup'

const defaultValues = {
  name: '',
  accessStart: '',
  accessEnd: ''
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  accessStart: yup.date().required('Access Start is required').typeError('Access Start is required'),
  accessEnd: yup.date().required('Access End is required').typeError('Access End is required')
})

const ExamPage = () => {
  const {
    query: { id }
  } = useRouter()

  const dispatch = useDispatch()

  const { exam } = useSelector(state => state.exam)

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchExamById({ id }))
      dispatch(fetchExamPaper({ examId: id }))
    }
  }, [dispatch, id])

  return (
    <ExamSingleView
      id={id}
      data={exam}
      control={control}
      errors={errors}
      handleSubmit={handleSubmit}
      reset={reset}
      setValue={setValue}
      watch={watch}
    />
  )
}

ExamPage.acl = {
  action: 'read',
  subject: 'ExamPaper'
}

export default ExamPage
