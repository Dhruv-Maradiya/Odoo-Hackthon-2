import axios from 'axios'

export const baseURL = process.env.BACKEND_API_URL

// Create an instance of axios
const api = axios.create({
  baseURL: baseURL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
