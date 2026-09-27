import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 4000);
    return () => clearInterval(interval);
  }, [showId]);

  const fetchSeats = () => {
    api.get(`/seats/?show_id=${showId}`)
      .then((response) => {
        setSeats(response.data);
        // If a seat we had selected got locked/booked by someone else in the
        // meantime, drop it from our selection automatically.
        setSelectedSeats((prevSelected) =>
          prevSelected.filter((id) => {
            const seat = response.data.find((s) => s.id === id);
            return seat && seat.status === 'available';
          })
        );
      })
      .catch(() => setError('Could not load seats.'));
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setMessage('');
    try {
      await Promise.all(
        selectedSeats.map((seatId) => api.post('/seats/lock/', { seat_id: seatId }))
      );
      const response = await api.post('/bookings/confirm/', {
        show_id: parseInt(showId),
        seat_ids: selectedSeats,
      });
      setMessage(`Booking confirmed! Booking ID: ${response.data.booking_id}`);
      setSelectedSeats([]);
      fetchSeats();
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Booking failed.');
      fetchSeats();
    }
  };

  const seatClasses = (seat) => {
    if (selectedSeats.includes(seat.id)) return 'bg-green-500 border-green-600 text-white';
    if (seat.status === 'booked') return 'bg-red-300 border-red-400 text-red-900 cursor-not-allowed';
    if (seat.status === 'locked') return 'bg-orange-300 border-orange-400 text-orange-900 cursor-not-allowed';
    return 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Seats</h2>

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

      <div className="flex flex-wrap gap-3 mb-6">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => toggleSeat(seat)}
            disabled={seat.status !== 'available' && !selectedSeats.includes(seat.id)}
            className={`w-12 h-12 rounded-md border text-sm font-medium transition-colors ${seatClasses(seat)}`}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 inline-block" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-green-500 inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-orange-300 inline-block" /> Locked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-red-300 inline-block" /> Booked
        </span>
      </div>

      <button
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
        className="w-full sm:w-auto bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        Book {selectedSeats.length} Seat(s)
      </button>
    </div>
  );
}

export default SeatSelection;