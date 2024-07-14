// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'src/utils/api'

// ** Fetch Exam
export const fetchExams = createAsyncThunk('fetchExams', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/exam', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch Exam by Id
export const fetchExamById = createAsyncThunk('fetchExamById', async ({ id }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/v1/exam/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Exam
export const createExam = createAsyncThunk('createExam', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/v1/exam', data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Update Exam
export const updateExam = createAsyncThunk('updateExam', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/v1/exam/${id}`, data)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete Exam
export const deleteExam = createAsyncThunk('deleteExam', async ({ id }, { rejectWithValue }) => {
  try {
    await api.delete(`/v1/exam/${id}`)

    return id
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const ExamsSlice = createSlice({
  name: 'appExams',
  initialState: {
    data: [],
    exam: null,
    total: 0,
    loading: false,
    creating: false,
    updating: false
  },
  extraReducers: builder => {
    builder.addCase(fetchExams.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchExams.fulfilled, (state, action) => {
      state.data = action.payload.data.exams
      state.total = action.payload.data.total
      state.loading = false
    })
    builder.addCase(fetchExams.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(fetchExamById.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchExamById.fulfilled, (state, action) => {
      state.exam = action.payload.data
      state.loading = false
    })
    builder.addCase(fetchExamById.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(createExam.pending, state => {
      state.creating = true
    })
    builder.addCase(createExam.fulfilled, (state, action) => {
      state.data = [...state.data, action.payload.data]
      state.creating = false
    })
    builder.addCase(createExam.rejected, (state, action) => {
      state.creating = false
    })
    builder.addCase(updateExam.pending, state => {
      state.updating = true
    })
    builder.addCase(updateExam.fulfilled, (state, action) => {
      state.data = state.data.map(item => (item.id === action.payload.data.id ? action.payload.data : item))
      state.updating = false
    })
    builder.addCase(updateExam.rejected, (state, action) => {
      state.updating = false
    })
  }
})

export default ExamsSlice.reducer
