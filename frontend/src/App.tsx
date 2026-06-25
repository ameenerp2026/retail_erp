import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from "./routes/routes"
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "./context/AuthContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5min
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App