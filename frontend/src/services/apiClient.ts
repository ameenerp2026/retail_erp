import axios from 'axios'
import { env } from '@/config/env'

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

apiClient.interceptors.request.use((config) => {


  const token =
    localStorage.getItem('token') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzdHJlYW15cy5pbiIsIm1haWwiOiJhZG1pbkBzdHJlYW15cy5pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc5MjU2MzU5NywiZXhwIjoyMTA3OTIzNTk3fQ.405po7ixiFtZoel54pjP4uN0w_KKOEWW1t95ALf1PcY'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
