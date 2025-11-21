// // seat-reserve-pro-frontend/src/components/attendee/EventList.tsx

import React from "react";
import { Link } from "react-router-dom";
import type { Event } from "../../types/Event";

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  // Add safety check for events
  if (!events || events.length === 0) {
    return <div>No events available</div>;
  }

  // Sort events by date, ascending
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
      }}
    >
      {sortedEvents.map((event, index) => (
        <div
          key={event._id || event.id || `event-${index}`}
          className="event-card"
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{event.title || "Untitled Event"}</h3>
          <p>
            <strong>Venue:</strong> {event.venue || "No venue specified"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "Date not set"}{" "}
            at{" "}
            {event.date
              ? new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Time not set"}
          </p>
          <p>
            <strong>Price:</strong> $
            {event.price ? event.price.toFixed(2) : "0.00"}
          </p>
          <p style={{ fontSize: "0.9em", color: "#555" }}>
            {event.description
              ? event.description.substring(0, 100) + "..."
              : "No description available"}
          </p>
          <Link
            to={`/events/${event._id}`}
            style={{
              display: "inline-block",
              padding: "8px 15px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            View & Book
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EventList;
