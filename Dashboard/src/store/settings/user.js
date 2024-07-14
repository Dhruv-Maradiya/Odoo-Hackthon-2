// ** Redux
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// ** API
import authConfig from 'src/configs/auth'
import api from 'src/utils/api'

export const resetStore = createAction('RESET_STORE')

// ** Fetch Me
export const me = createAsyncThunk(
  'appSetting/fetchUser',
  async ({ successCallback, errorCallback }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUserLoading(false))

      const res = await api.get(authConfig.meEndpoint)

      const user = res.data.data

      dispatch(setUser(user))

      successCallback(user)

      return res.data
    } catch (err) {
      errorCallback(err)

      return rejectWithValue(err)
    } finally {
      dispatch(setUserLoading(false))
    }
  }
)

// ** Fetch users
export const fetchUsers = createAsyncThunk('appSetting/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/users', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create User
export const createUser = createAsyncThunk('appSetting/createUser', async (data, { rejectWithValue, getState }) => {
  try {
    const res = await api.post('/v1/users', {
      name: data.name,
      email: data.email,
      enabled: data.enabled,
      role: data.role,
      managerId: data.manager,
      departmentId: data.department,
      jobTitleId: data.jobTitle,
      dateOfJoining: data.joinDate,
      lastAccessDate: data.lastDate
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Create Multiple User
export const createMultipleUser = createAsyncThunk(
  'appSetting/createMultipleUser',
  async (data, { rejectWithValue, getState }) => {
    try {
      const res = await api.post('/v1/users/multiple', data)

      return res.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ** Edit User
export const updateUser = createAsyncThunk('appSetting/updateUser', async (data, { rejectWithValue, getState }) => {
  try {
    const res = await api.put(`/v1/users/${data.id}`, {
      name: data.name,
      email: data.email,
      enabled: data.enabled,
      role: data.role,
      managerId: data.manager,
      departmentId: data.department,
      jobTitleId: data.jobTitle,
      dateOfJoining: data.joinDate,
      lastAccessDate: data.lastDate
    })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Delete User

export const deleteUser = createAsyncThunk('appSetting/deleteUser', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/v1/users/${id}`)

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Get Audit
export const getAudit = createAsyncThunk('appSetting/getAudit', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/v1/audit', { params })

    return res.data
  } catch (err) {
    return rejectWithValue(err)
  }
})

// ** Slice
export const appSettingSlice = createSlice({
  name: 'appSetting',
  initialState: {
    user: null,
    userLoading: false,
    users: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      editData: null,
      drawerOpen: false
    },
    logs: []
  },
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setEditData: (state, action) => {
      state.users.editData = action.payload
    },
    setDrawerOpen: (state, action) => {
      state.users.drawerOpen = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.users.loading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload
      state.users.loading = false
      state.users.total = action.payload?.pagination?.count
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.users.loading = false
    })

    builder.addCase(createUser.pending, state => {
      state.users.creating = true
    })
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.users.data.push(action.payload.data)
      state.users.creating = false
    })
    builder.addCase(createUser.rejected, (state, action) => {
      state.users.creating = false
    })

    builder.addCase(updateUser.pending, state => {
      state.users.updating = true
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.users.data = state.users.data.map(user => {
        if (user.id === action.payload.data.id) {
          return action.payload.data
        }

        return user
      })
      state.users.updating = false
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.users.updating = false
    })
    builder.addCase(deleteUser.pending, state => {
      state.users.deleting = true
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users.data = state.users.data.filter(user => user.id !== action.payload.data.id)
      state.users.deleting = false
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.users.deleting = false
    })
    builder.addCase(getAudit.pending, state => {
      state.users.loading = true
    })
    builder.addCase(getAudit.fulfilled, (state, action) => {
      state.logs = action.payload.data
      state.users.loading = false
    })
    builder.addCase(getAudit.rejected, (state, action) => {
      state.users.loading = false
    })
  }
})

export const { setUserLoading, setUser, setEditData, setDrawerOpen } = appSettingSlice.actions

export default appSettingSlice.reducer
