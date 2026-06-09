

import AppRoutes from "./routes/routes";
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "./context/AuthContext"

function App() {
 
  return (
 <>
 <AuthProvider>
  <AppRoutes />
  <Toaster position="top-right" />
 </AuthProvider>
  </>
  )
}

export default App
