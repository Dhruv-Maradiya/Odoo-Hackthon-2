// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'src/utils/api'

// ** Fetch Exam
export const fetchExamPaper = createAsyncThunk('fetchExamPaper', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/exam-paper', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch Exam by Id
export const fetchExamPaperById = createAsyncThunk('fetchExamPaperById', async ({ id }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/exam-paper/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Exam
export const createExamPaper = createAsyncThunk('createExamPaper', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/exam-paper', data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Exam
export const updateExamPaper = createAsyncThunk('updateExamPaper', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/exam-paper/${id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Exam
export const deleteExamPaper = createAsyncThunk('deleteExamPaper', async ({ id }, { rejectWithValue }) => {
  try {
    await api.delete(`/v1/exam-paper/${id}`)

    return id
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Upload Image
export const uploadImage = createAsyncThunk('uploadImage', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post('/v1/exam-paper/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const ExamPaperSlice = createSlice({
  name: 'appExamPaper',
  initialState: {
    data: [],
    examPaper: null,
    total: 0,
    loading: false,
    creating: false,
    updating: false
  },
  extraReducers: builder => {
    builder.addCase(fetchExamPaper.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchExamPaper.fulfilled, (state, action) => {
      state.data = action.payload.data.papers
      state.total = action.payload.data.count
      state.loading = false
    })
    builder.addCase(fetchExamPaper.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(fetchExamPaperById.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchExamPaperById.fulfilled, (state, action) => {
      state.examPaper = action.payload.data
      state.loading = false
    })
    builder.addCase(fetchExamPaperById.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(createExamPaper.pending, state => {
      state.creating = true
    })
    builder.addCase(createExamPaper.fulfilled, (state, action) => {
      state.data = [...state.data, action.payload.data]
      state.creating = false
    })
    builder.addCase(createExamPaper.rejected, (state, action) => {
      state.creating = false
    })
    builder.addCase(updateExamPaper.pending, state => {
      state.updating = true
    })
    builder.addCase(updateExamPaper.fulfilled, (state, action) => {
      state.data = state.data.map(item => (item.id === action.payload.data.id ? action.payload.data : item))
      state.updating = false
    })
    builder.addCase(updateExamPaper.rejected, (state, action) => {
      state.updating = false
    })
  }
})

export default ExamPaperSlice.reducer
