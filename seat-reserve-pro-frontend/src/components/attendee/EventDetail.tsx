import React from "react";
import BookingSummary from "./BookingSummary";
import SeatMap from "./SeatMap";
import type { Event } from "../../types/Event"; // Import the existing Event interface

const EventDetail: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  // TODO: Replace this with your actual event fetching logic
  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/events/${eventId}`);
        // const eventData = await response.json();

        // Mock data that matches the actual Event interface from types/Event.ts
        const mockEvent: Event = {
          _id: "1",
          title: "Sample Event",
          date: "2024-12-31T20:00:00Z",
          venue: "Main Hall",
          description: "This is a sample event description",
          capacity: 100,
          price: 50,
          seats: [
            {
              _id: "s1",
              seatId: "A1",
              isBooked: false,
              bookedBy: null,
            },
            {
              _id: "s2",
              seatId: "A2",
              isBooked: true,
              bookedBy: "user123",
            },
            // Add more seats as needed
          ],
          soldTickets: 25,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          id: "",
        };
        setSelectedEvent(mockEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, []);

  if (!selectedEvent) return <div>Loading event details...</div>;

  return (
    <div
      className="event-detail-container"
      style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* Event Details Display */}
      <h1>{selectedEvent.title}</h1>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Note: Your Event interface doesn't include an image property */}
        {/* If you need images, you might want to add it to the Event interface */}
        <div
          style={{
            width: "300px",
            height: "200px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Event Image
        </div>
        <div>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedEvent.date).toLocaleString()}
          </p>
          <p>
            <strong>Venue:</strong> {selectedEvent.venue}
          </p>
          <p>
            <strong>Capacity:</strong> {selectedEvent.capacity}
          </p>
          <p>
            <strong>Available Seats:</strong>{" "}
            {selectedEvent.capacity - (selectedEvent.soldTickets || 0)} /{" "}
            {selectedEvent.capacity}
          </p>
          <p>
            <strong>Price:</strong> ${selectedEvent.price}
          </p>
          {selectedEvent.description && (
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
          )}
          <p>
            <strong>Status:</strong>{" "}
            {selectedEvent.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <hr />

      <h3>Real-Time Seat Availability</h3>
      <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
        <div style={{ flex: 2 }}>
          <SeatMap event={selectedEvent} />
        </div>
        <div
          style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "30px" }}
        >
          <BookingSummary event={selectedEvent} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
