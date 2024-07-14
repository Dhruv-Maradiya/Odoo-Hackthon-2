import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import AddEditExamPaper from './AddEditExamPaper'
import { useSelector } from 'react-redux'
import { baseURL } from 'src/utils/api'
import moment from 'moment'

const ExamSingleView = ({ id, control, handleSubmit, reset, setValue, errors, watch, data: exam }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [file, setFile] = useState(null)

  const { data } = useSelector(state => state.examPaper)

  if (!exam)
    return (
      <Card>
        <CardHeader title='No papers found' />
      </Card>
    )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='h5'>{exam.name}</Typography>
            <Chip label={exam.status} color={exam.status === 'ONGOING' ? 'success' : 'error'} />
          </Box>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setDrawerOpen(true)
            }}
          >
            Add Exam Paper
          </Button>
        </CardContent>
        <AddEditExamPaper
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setFile(null)
            reset()
          }}
          file={file}
          setFile={setFile}
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          reset={reset}
          setValue={setValue}
          watch={watch}
          id={id}
        />
      </Card>
      {!data ||
        (!data.length && (
          <Card>
            <CardHeader title='No papers found' />
          </Card>
        ))}
      <Grid container>
        {data &&
          data.map(paper => (
            <Grid key={paper.id} item xl={4}>
              <Card
                sx={{
                  width: '100%'
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant='h6'>{paper.name}</Typography>
                    <Typography variant='body1'>
                      Access Start: {moment(paper.accessStart).format('DD/MM/YYYY HH:mm A')}
                    </Typography>
                    <Typography variant='body1'>
                      Access End:{moment(paper.accessEnd).format('DD/MM/YYYY HH:mm A')}
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={async () => {
                        // ** Download the file
                        const url = `${baseURL}/uploads/${paper.url}`

                        const response = await fetch(url)
                        const blob = await response.blob()
                        const downloadUrl = URL.createObjectURL(blob)

                        const link = document.createElement('a')
                        link.href = downloadUrl
                        link.download = paper.name // You can change the filename here
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)

                        URL.revokeObjectURL(downloadUrl)
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default ExamSingleView
