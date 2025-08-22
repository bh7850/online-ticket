import React, { useState, useEffect } from "react";

const mockEvents = [
  { id: 1, name: "Rock Concert", totalSeats: 100, bookedSeats: 40 },
  { id: 2, name: "Stand-up Comedy", totalSeats: 80, bookedSeats: 20 },
  { id: 3, name: "Movie Premiere", totalSeats: 120, bookedSeats: 70 },
];

// Simulate API call to fetch events
const fetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEvents]);
    }, 500);
  });
};

// Simulate API update for booking/cancellation
const updateSeat = (eventId, action) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find((e) => e.id === eventId);
      if (action === "book" && event.bookedSeats < event.totalSeats) {
        event.bookedSeats += 1;
      } else if (action === "cancel" && event.bookedSeats > 0) {
        event.bookedSeats -= 1;
      }
      resolve(event);
    }, 400);
  });
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch events initially and every 30s for auto-sync
  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(() => {
      loadEvents();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async (eventId, action) => {
    setMessage("Processing...");
    await updateSeat(eventId, action);
    await loadEvents();
    setMessage(action === "book" ? "Seat booked!" : "Booking cancelled!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>🎟 Live Event Ticket Marketplace</h1>
      {loading && <p>Loading events...</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {events.map((event) => {
          const availableSeats = event.totalSeats - event.bookedSeats;
          return (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{event.name}</h2>
              <p>
                Total Seats: <strong>{event.totalSeats}</strong>
              </p>
              <p>
                Booked Seats: <strong>{event.bookedSeats}</strong>
              </p>
              <p>
                Available Seats:{" "}
                <strong style={{ color: availableSeats > 0 ? "green" : "red" }}>
                  {availableSeats}
                </strong>
              </p>
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{
                    padding: "8px 12px",
                    marginRight: "10px",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleBooking(event.id, "book")}
                  disabled={availableSeats === 0}
                >
                  Book Seat
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleBooking(event.id, "cancel")}
                  disabled={event.bookedSeats === 0}
                >
                  Cancel Seat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}