// seat-reserve-pro-frontend/src/pages/EventsPage.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchEvents } from "../redux/slices/eventsSlice";
import EventList from "../components/attendee/EventList";

const EventsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(
    (state: RootState) => state.events
  );

  // Fetch the public list of active events when the page loads
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div
      className="events-page-container"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1>📅 Upcoming Events</h1>
      <p>
        Browse and book tickets for the latest concerts, conferences, and more!
      </p>
      <hr />

      {isLoading ? (
        <p>Loading events...</p>
      ) : isError ? (
        <p style={{ color: "red" }}>Error loading events: {message}</p>
      ) : events.length === 0 ? (
        <p>No active events found. Check back soon!</p>
      ) : (
        // Pass the fetched events to the list component
        <EventList events={events} />
      )}
    </div>
  );
};

export default EventsPage;
