import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import SeatSelection from './pages/SeatSelection';
import Profile from './pages/Profile';
import { AuthContextProvider } from './context/authContext';

const router = createBrowserRouter([
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <MovieDetail />,
    path: '/movie-detail'
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
    element: <Profile />,
    path: '/profile'
  },
  {
    element: <Profile />,
    path: '/my-tickets'
  }
])

function App() {

  return (
    <>
      <AuthContextProvider>
        
      </AuthContextProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </>
  )
}

export default App
