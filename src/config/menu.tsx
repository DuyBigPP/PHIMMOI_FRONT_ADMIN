import React from "react"
import { Home, /* Settings, */ Film, Users, Tag} from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode
  // Optional children for submenus
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
/*   { 
    label: "Movies", 
    path: "/movies", 
    icon: <Film size={16} />,
    children: [
      { label: "All Movies", path: "/movies/list", icon: <Database size={16} /> },
      { label: "Add Movie", path: "/movies/add", icon: <Film size={16} /> },
    ]
  }, */

  { label: "Movies", path: "/movie-management", icon: <Film size={16} /> },
  { label: "Users", path: "/user-management", icon: <Users size={16} /> },
  { label: "Genres", path: "/genre-management", icon: <Tag size={16} /> },
/*   { label: "Settings", path: "/settings", icon: <Settings size={16} /> }, */
]