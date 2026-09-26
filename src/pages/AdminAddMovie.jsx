import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

function AdminAddMovie() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    poster_url: '',
    duration: '',
    age_rating: '',
  });
  const [tmdbTitle, setTmdbTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/movies/', {
        ...formData,
        duration: parseInt(formData.duration),
      });
      setMessage('Movie added successfully!');
      setFormData({ title: '', genre: '', description: '', poster_url: '', duration: '', age_rating: '' });
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Failed to add movie. Are you logged in as admin?');
    }
  };

  const handleTmdbFetch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await api.post('/movies/fetch-tmdb/', { title: tmdbTitle });
      setMessage(`Movie "${response.data.movie.title}" added from TMDB!`);
      setTmdbTitle('');
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Failed to fetch from TMDB. Are you logged in as admin?');
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500';

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link to="/" className="text-purple-600 hover:underline text-sm">
        ← Back to Movies
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-6">Admin: Add Movie</h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 break-words">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          {message}
        </p>
      )}

      <div className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Fetch from TMDB</h3>
        <form onSubmit={handleTmdbFetch} className="flex gap-2">
          <input
            placeholder="Movie title (e.g. Inception)"
            value={tmdbTitle}
            onChange={(e) => setTmdbTitle(e.target.value)}
            required
            className={inputClass}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            Fetch & Add
          </button>
        </form>
      </div>

      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Or Add Manually</h3>
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className={inputClass} />
          <input name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} required className={inputClass} />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className={inputClass}
          />
          <input name="poster_url" placeholder="Poster URL" value={formData.poster_url} onChange={handleChange} required className={inputClass} />
          <input
            name="duration"
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input name="age_rating" placeholder="Age Rating (e.g. UA)" value={formData.age_rating} onChange={handleChange} required className={inputClass} />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddMovie;