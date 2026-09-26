import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import Login from './pages/Login.jsx';
import MovieList from './pages/MovieList.jsx';
import ShowList from './pages/ShowList.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import MyBookings from './pages/MyBookings.jsx';
import AdminAddMovie from './pages/AdminAddMovie.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/movies/:movieId/shows" element={<ShowList />} />
      <Route path="/shows/:showId/seats" element={<SeatSelection />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/admin/add-movie" element={<AdminAddMovie />} />
    </Routes>
  );
}

export default App;