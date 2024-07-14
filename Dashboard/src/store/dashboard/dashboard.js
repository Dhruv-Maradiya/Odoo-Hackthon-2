// ** Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import api from 'src/utils/api'

// ** Fetch surveys
export const fetchSurveys = createAsyncThunk('fetchSurveys', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/surveys', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Fetch survey by User

export const fetchAvailableSurveys = createAsyncThunk('fetchSurveyByUser', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/surveys/available', {
      params
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appDashboardSlice = createSlice({
  name: 'appDashboard',
  initialState: {
    data: [],
    loading: false
  },
  extraReducers: builder => {
    builder.addCase(fetchSurveys.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchSurveys.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.loading = false
    })
    builder.addCase(fetchSurveys.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(fetchAvailableSurveys.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchAvailableSurveys.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.loading = false
    })
    builder.addCase(fetchAvailableSurveys.rejected, (state, action) => {
      state.loading = false
    })
  }
})

export default appDashboardSlice.reducer
