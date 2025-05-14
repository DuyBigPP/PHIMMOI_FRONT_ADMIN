// Base API service for movie admin dashboard
// These functions will be replaced with actual API calls in the future

// Mock data types
export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  duration: number; // in minutes
  posterUrl: string;
  coverUrl: string;
  rating: number;
  genreIds: string[];
  views: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'banned';
  registeredDate: string;
  lastLogin: string;
  subscription: 'free' | 'basic' | 'premium' | 'none';
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  movieCount: number;
}

export interface AnalyticsData {
  totalViews: number;
  monthlyViews: number[];
  popularGenres: { id: string; name: string; views: number }[];
  viewsByDevice: { device: string; count: number }[];
  viewsByTime: { hour: number; count: number }[];
  topMovies: { id: string; title: string; views: number }[];
}

// API endpoint functions to be implemented later
export const api = {
  movies: {
    getAll: async (): Promise<Movie[]> => mockMovies,
    getById: async (id: string): Promise<Movie | undefined> => 
      mockMovies.find(movie => movie.id === id),
    create: async (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<Movie> => {
      // Mock implementation
      return mockMovies[0];
    },
    update: async (id: string, movie: Partial<Movie>): Promise<Movie | undefined> => {
      // Mock implementation
      return mockMovies.find(m => m.id === id);
    },
    delete: async (id: string): Promise<boolean> => {
      // Mock implementation
      return true;
    }
  },
  users: {
    getAll: async (): Promise<User[]> => mockUsers,
    getById: async (id: string): Promise<User | undefined> => 
      mockUsers.find(user => user.id === id),
    update: async (id: string, user: Partial<User>): Promise<User | undefined> => {
      // Mock implementation
      return mockUsers.find(u => u.id === id);
    },
    delete: async (id: string): Promise<boolean> => {
      // Mock implementation
      return true;
    }
  },
  genres: {
    getAll: async (): Promise<Genre[]> => mockGenres,
    getById: async (id: string): Promise<Genre | undefined> => 
      mockGenres.find(genre => genre.id === id),
    create: async (genre: Omit<Genre, 'id' | 'movieCount'>): Promise<Genre> => {
      // Mock implementation
      return mockGenres[0];
    },
    update: async (id: string, genre: Partial<Genre>): Promise<Genre | undefined> => {
      // Mock implementation
      return mockGenres.find(g => g.id === id);
    },
    delete: async (id: string): Promise<boolean> => {
      // Mock implementation
      return true;
    }
  },
  analytics: {
    getDashboardData: async (): Promise<AnalyticsData> => mockAnalyticsData,
  }
};

// Mock Data
const mockMovies: Movie[] = [
  {
    id: "m1",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    duration: 148,
    posterUrl: "https://placehold.co/300x450?text=Inception",
    coverUrl: "https://placehold.co/1200x600?text=Inception+Cover",
    rating: 8.8,
    genreIds: ["g1", "g3"],
    views: 1250000,
    featured: true,
    status: "published",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-03-20T08:45:00Z"
  },
  {
    id: "m2",
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    duration: 142,
    posterUrl: "https://placehold.co/300x450?text=Shawshank",
    coverUrl: "https://placehold.co/1200x600?text=Shawshank+Cover",
    rating: 9.3,
    genreIds: ["g2"],
    views: 980000,
    featured: true,
    status: "published",
    createdAt: "2023-02-10T14:20:00Z",
    updatedAt: "2023-04-05T11:15:00Z"
  },
  {
    id: "m3",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    duration: 152,
    posterUrl: "https://placehold.co/300x450?text=Dark+Knight",
    coverUrl: "https://placehold.co/1200x600?text=Dark+Knight+Cover",
    rating: 9.0,
    genreIds: ["g1", "g4"],
    views: 1100000,
    featured: true,
    status: "published",
    createdAt: "2023-03-05T09:10:00Z",
    updatedAt: "2023-05-12T16:30:00Z"
  },
  {
    id: "m4",
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    duration: 154,
    posterUrl: "https://placehold.co/300x450?text=Pulp+Fiction",
    coverUrl: "https://placehold.co/1200x600?text=Pulp+Fiction+Cover",
    rating: 8.9,
    genreIds: ["g2", "g5"],
    views: 850000,
    featured: false,
    status: "published",
    createdAt: "2023-01-25T12:40:00Z",
    updatedAt: "2023-03-28T10:20:00Z"
  },
  {
    id: "m5",
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    duration: 136,
    posterUrl: "https://placehold.co/300x450?text=Matrix",
    coverUrl: "https://placehold.co/1200x600?text=Matrix+Cover",
    rating: 8.7,
    genreIds: ["g1", "g3"],
    views: 1050000,
    featured: false,
    status: "published",
    createdAt: "2023-02-18T08:15:00Z",
    updatedAt: "2023-04-22T14:50:00Z"
  },
  {
    id: "m6",
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    releaseYear: 1990,
    duration: 145,
    posterUrl: "https://placehold.co/300x450?text=Goodfellas",
    coverUrl: "https://placehold.co/1200x600?text=Goodfellas+Cover",
    rating: 8.7,
    genreIds: ["g2", "g6"],
    views: 780000,
    featured: false,
    status: "published",
    createdAt: "2023-03-12T16:25:00Z",
    updatedAt: "2023-05-08T09:35:00Z"
  }
];

const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://placehold.co/100x100?text=JD",
    role: "admin",
    status: "active",
    registeredDate: "2022-05-12T10:30:00Z",
    lastLogin: "2023-06-28T15:45:00Z",
    subscription: "premium"
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://placehold.co/100x100?text=JS",
    role: "user",
    status: "active",
    registeredDate: "2022-06-23T14:20:00Z",
    lastLogin: "2023-06-25T09:15:00Z",
    subscription: "basic"
  },
  {
    id: "u3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    avatar: "https://placehold.co/100x100?text=RJ",
    role: "editor",
    status: "inactive",
    registeredDate: "2022-04-05T08:10:00Z",
    lastLogin: "2023-05-18T11:30:00Z",
    subscription: "premium"
  },
  {
    id: "u4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    avatar: "https://placehold.co/100x100?text=SW",
    role: "user",
    status: "active",
    registeredDate: "2022-08-17T16:40:00Z",
    lastLogin: "2023-06-27T14:50:00Z",
    subscription: "free"
  },
  {
    id: "u5",
    name: "Michael Brown",
    email: "michael.b@example.com",
    avatar: "https://placehold.co/100x100?text=MB",
    role: "user",
    status: "banned",
    registeredDate: "2022-07-09T12:15:00Z",
    lastLogin: "2023-05-10T10:25:00Z",
    subscription: "none"
  }
];

const mockGenres: Genre[] = [
  {
    id: "g1",
    name: "Action",
    slug: "action",
    description: "Action films are a film genre where action sequences, such as fighting, stunts, car chases or explosions, take precedence over elements like character development or complex plotting.",
    movieCount: 256
  },
  {
    id: "g2",
    name: "Drama",
    slug: "drama",
    description: "Drama films are a genre that relies on the emotional and relational development of realistic characters.",
    movieCount: 412
  },
  {
    id: "g3",
    name: "Sci-Fi",
    slug: "sci-fi",
    description: "Science fiction films are a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.",
    movieCount: 185
  },
  {
    id: "g4",
    name: "Superhero",
    slug: "superhero",
    description: "Superhero films are a subgenre of action, fantasy, and science fiction films that focus on a superhero character endowed with extraordinary abilities.",
    movieCount: 89
  },
  {
    id: "g5",
    name: "Crime",
    slug: "crime",
    description: "Crime films are a film genre inspired by and analogous to the crime fiction literary genre.",
    movieCount: 178
  },
  {
    id: "g6",
    name: "Biography",
    slug: "biography",
    description: "Biographical films are a film genre that dramatizes the life of a real, non-fictional individual.",
    movieCount: 142
  }
];

const mockAnalyticsData: AnalyticsData = {
  totalViews: 5750000,
  monthlyViews: [420000, 385000, 512000, 490000, 560000, 610000, 580000, 620000, 540000, 480000, 520000, 530000],
  popularGenres: [
    { id: "g1", name: "Action", views: 1850000 },
    { id: "g3", name: "Sci-Fi", views: 1350000 },
    { id: "g2", name: "Drama", views: 950000 },
    { id: "g5", name: "Crime", views: 850000 },
    { id: "g4", name: "Superhero", views: 750000 }
  ],
  viewsByDevice: [
    { device: "Mobile", count: 2300000 },
    { device: "Desktop", count: 1750000 },
    { device: "Tablet", count: 950000 },
    { device: "TV", count: 750000 }
  ],
  viewsByTime: [
    { hour: 0, count: 120000 },
    { hour: 1, count: 85000 },
    { hour: 2, count: 65000 },
    { hour: 3, count: 45000 },
    { hour: 4, count: 35000 },
    { hour: 5, count: 50000 },
    { hour: 6, count: 85000 },
    { hour: 7, count: 130000 },
    { hour: 8, count: 180000 },
    { hour: 9, count: 210000 },
    { hour: 10, count: 220000 },
    { hour: 11, count: 240000 },
    { hour: 12, count: 270000 },
    { hour: 13, count: 290000 },
    { hour: 14, count: 280000 },
    { hour: 15, count: 260000 },
    { hour: 16, count: 300000 },
    { hour: 17, count: 340000 },
    { hour: 18, count: 410000 },
    { hour: 19, count: 490000 },
    { hour: 20, count: 580000 },
    { hour: 21, count: 620000 },
    { hour: 22, count: 480000 },
    { hour: 23, count: 230000 }
  ],
  topMovies: [
    { id: "m1", title: "Inception", views: 1250000 },
    { id: "m3", title: "The Dark Knight", views: 1100000 },
    { id: "m5", title: "The Matrix", views: 1050000 },
    { id: "m2", title: "The Shawshank Redemption", views: 980000 },
    { id: "m4", title: "Pulp Fiction", views: 850000 }
  ]
}; 