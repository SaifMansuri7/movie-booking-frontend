import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';

function ShowList() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/movies/'),
      api.get('/shows/'),
      api.get('/theatres/'),
    ])
      .then(([moviesRes, showsRes, theatresRes]) => {
        const foundMovie = moviesRes.data.find((m) => m.id === parseInt(movieId));
        setMovie(foundMovie);
        setShows(showsRes.data.filter((s) => s.movie === parseInt(movieId)));
        setTheatres(theatresRes.data);
      })
      .catch(() => setError('Could not load shows.'));
  }, [movieId]);

  const getTheatreName = (theatreId) => {
    const theatre = theatres.find((t) => t.id === theatreId);
    return theatre ? `${theatre.name}, ${theatre.city}` : 'Unknown Theatre';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="text-purple-600 hover:underline text-sm">
        ← Back to Movies
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
        {movie ? movie.title : 'Loading...'}
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {shows.length === 0 && !error && (
        <p className="text-gray-500">No shows available for this movie yet.</p>
      )}

      <div className="space-y-4">
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div>
              <p className="font-semibold text-gray-900">{getTheatreName(show.theatre)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(show.show_datetime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">₹{show.price}</p>
            </div>
            <Link to={`/shows/${show.id}/seats`}>
              <button className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap">
                Select Seats
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowList;