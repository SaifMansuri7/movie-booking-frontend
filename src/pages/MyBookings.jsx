import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    api.get('/bookings/my/')
      .then((response) => setBookings(response.data))
      .catch(() => setError('Could not load bookings.'));
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await api.post('/bookings/cancel/', { booking_id: bookingId });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError('Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

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
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-start justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.show?.movie_title || `Show #${booking.show?.id ?? ''}`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {booking.show?.show_datetime &&
                  new Date(booking.show.show_datetime).toLocaleString()}
              </p>
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${
                  booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {booking.status}
              </span>
            </div>

            {booking.status !== 'cancelled' && (
              <button
                onClick={() => handleCancel(booking.id)}
                disabled={cancellingId === booking.id}
                className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 shrink-0"
              >
                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;