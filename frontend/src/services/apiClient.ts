import axios from 'axios'
import { env } from '@/config/env'

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

apiClient.interceptors.request.use((config) => {
  //  console.log("🔥 INTERCEPTOR RUNNING");
  // console.log("🔥 URL:", config.url);

  const token = localStorage.getItem('token')
  
 // console.log("Token from localStorage:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
