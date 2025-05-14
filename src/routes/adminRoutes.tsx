import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/AdminLayout"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import SettingsPage from "@/pages/settings/SettingsPage"
import MoviesListPage from "@/pages/movies/MoviesListPage"
import MovieAddPage from "@/pages/movies/MovieAddPage"
import MovieEditPage from "@/pages/movies/MovieEditPage"
import MovieDetailsPage from "@/pages/movies/MovieDetailsPage"
import UsersPage from "@/pages/users/UsersPage"
import UserDetailsPage from "@/pages/users/UserDetailsPage"
import GenresPage from "@/pages/genres/GenresPage"
import GenreDetailsPage from "@/pages/genres/GenreDetailsPage"

export function AdminRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Movie routes */}
          <Route path="movies" element={<Navigate to="/movies/list" replace />} />
          <Route path="movies/list" element={<MoviesListPage />} />
          <Route path="movies/add" element={<MovieAddPage />} />
          <Route path="movies/:id" element={<MovieDetailsPage />} />
          <Route path="movies/:id/edit" element={<MovieEditPage />} />

          {/* User routes */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} />

          {/* Genre routes */}
          <Route path="genres" element={<GenresPage />} />
          <Route path="genres/:id" element={<GenreDetailsPage />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Redirect old analytics route to dashboard */}
          <Route path="analytics" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}