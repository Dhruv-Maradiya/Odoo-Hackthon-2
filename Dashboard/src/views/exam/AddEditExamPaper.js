import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { DialogTitle } from '@material-ui/core'
import { Controller } from 'react-hook-form'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { createExamPaper, uploadImage } from 'src/store/exam-paper/exam-paper'
import { unwrapResult } from '@reduxjs/toolkit'

const AddEditExamPaper = ({ open, onClose, file, setFile, control, handleSubmit, errors, watch, id }) => {
  const dispatch = useDispatch()

  const submit = async data => {
    try {
      if (!file) {
        toast.error('Please upload a file')
      }

      let res = await dispatch(uploadImage(file))
      res = unwrapResult(res)

      await dispatch(
        createExamPaper({
          ...data,
          accessStartTime: data.accessStart,
          accessEndTime: data.accessEnd,
          examId: id,
          url: res.data.url
        })
      )

      unwrapResult(res)

      toast.success('Exam paper uploaded successfully')

      onClose()
    } catch (err) {
      toast.error('Failed to upload exam paper')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Upload Exam Paper</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submit)}>
          <Grid container spacing={3} p={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      label='Name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth error={Boolean(errors.accessStart)}>
                <Controller
                  name='accessStart'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <LocalizationProvider renderInput={params => <TextField {...params} />} dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        label='Start Date'
                        slotProps={{ textField: { size: 'small', error: Boolean(errors.accessStart) } }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.accessStart && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.accessStart.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth error={Boolean(errors.accessEnd)}>
                <Controller
                  name='accessEnd'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs} renderInput={params => <TextField {...params} />}>
                      <DateTimePicker
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        label='End Date'
                        minDate={watch('accessStart')}
                        slotProps={{ textField: { size: 'small', error: Boolean(errors.accessEnd) } }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.accessEnd && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.accessEnd.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {file && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    m: 1
                  }}
                >
                  <Typography variant='body1'>{file.name}</Typography>
                </Box>
              )}
              <Button
                variant='contained'
                component='label'
                startIcon={<FileUploadIcon />}
                onClick={() => {
                  document.getElementById('file-input-exam-paper').click()
                }}
              >
                Upload File
              </Button>
              <input
                type='file'
                accept='application/pdf'
                id='file-input-exam-paper'
                hidden
                onChange={e => {
                  setFile(e.target.files[0])
                }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          component='label'
          color='error'
          variant='outlined'
          onClick={() => {
            onClose()
          }}
        >
          Cancel
        </Button>
        <Button variant='contained' component='label' color='primary' onClick={handleSubmit(submit)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditExamPaper
