import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import SettingsPage from "@/pages/settings/SettingsPage"
import UserManagement from "@/pages/user_management"
import MovieManagement from "@/pages/movie_management"
import GenreManagement from "@/pages/genre_management"
export function AdminRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          

          {/* User Management */}
          <Route path="user-management" element={<UserManagement />} />

          {/* Movie Management */}
          <Route path="movie-management" element={<MovieManagement />} />

          {/* Genre Management */}
          <Route path="genre-management" element={<GenreManagement />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Redirect old analytics route to dashboard */}
          <Route path="analytics" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}