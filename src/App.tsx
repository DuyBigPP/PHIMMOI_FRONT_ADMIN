import { AdminRoutes } from "@/routes/adminRoutes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <ToastProvider>
        <AdminRoutes />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App