import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/movies/')
      .then((response) => setMovies(response.data))
      .catch(() => setError('Could not load movies.'));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Navbar */}
      <nav className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">🎬 Movie Booking</h1>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.username}!</span>
              <Link to="/my-bookings" className="text-purple-600 hover:underline">
                My Bookings
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/add-movie" className="text-purple-600 hover:underline">
                  Add Movie
                </Link>
              )}
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-purple-600 hover:underline">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Movie grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}/shows`}
            className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <div className="w-full h-64 bg-gray-100 overflow-hidden">
              <img
                src={movie.poster_url || 'https://placehold.co/300x400?text=No+Poster'}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x400?text=No+Poster';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 truncate">{movie.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {movie.genre} · {movie.duration} min · {movie.age_rating}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {!error && movies.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No movies available right now.</p>
      )}
    </div>
  );
}

export default MovieList;