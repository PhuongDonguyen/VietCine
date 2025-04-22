import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import SeatSelection from './pages/SeatSelection';
import Profile from './pages/Profile';
import { AuthContextProvider } from './context/authContext';
import Signup from './pages/Signup';
import AllAvailableMovie from './pages/AllAvailableMovie';
import Theaters from './pages/MovieShowtimesTheater';

const router = createBrowserRouter([
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <AllAvailableMovie />,
    path: '/movies'
  },
  {
    element: <MovieDetail />,
    path: '/movies/:slug'
  },
  {
    element: <SeatSelection />,
    path: '/seat-selection'
  },
  {
    element: <Login />,
    path: '/login'
  },
  {
    element: <Signup />,
    path: '/signup'
  },
  {
    element: <Profile />,
    path: '/profile'
  },
  {
    element: <Profile />,
    path: '/my-tickets'
  },
  {
    element: <Theaters />,
    path: '/book-tickets'
  }
])

function App() {

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router}>
        </RouterProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
