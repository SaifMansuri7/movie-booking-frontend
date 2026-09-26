import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    api.get('/bookings/my/')
      .then((response) => setBookings(response.data))
      .catch(() => setError('Could not load bookings.'));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">
          Please{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            login
          </Link>{' '}
          to see your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="text-purple-600 hover:underline text-sm">
        ← Back to Movies
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-6">My Bookings</h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {bookings.length === 0 && !error && (
        <p className="text-gray-500">You have no bookings yet.</p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 overflow-x-auto">
              {JSON.stringify(booking, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;