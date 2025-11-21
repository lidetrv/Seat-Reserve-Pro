// seat-reserve-pro-frontend/src/components/admin/AdminDashboard.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchEvents,
  deleteEvent,
  setSelectedEvent,
} from "../../redux/slices/eventsSlice";
import EventForm from "./EventForm";
import SalesChart from "./SalesChart"; // We'll write this later
import type { Event } from "../../types/Event";

const AdminDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { events, isLoading, selectedEvent } = useSelector(
    (state: RootState) => state.events
  );

  // State to toggle the form visibility (for creation/editing)
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch all events when the dashboard loads
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch(setSelectedEvent(null)); // Clear any selected event
    setIsFormVisible(true);
  };

  const handleEdit = (event: Event) => {
    dispatch(setSelectedEvent(event));
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    dispatch(setSelectedEvent(null));
    dispatch(fetchEvents()); // Refresh list after form action
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to deactivate this event? This action cannot be undone."
      )
    ) {
      dispatch(deleteEvent(id));
    }
  };

  if (isLoading) {
    return <p>Loading event data...</p>;
  }

  return (
    <div>
      {/* 1. Sales Analytics Section */}
      <h2>Sales Overview</h2>
      <SalesChart events={events} />
      <hr />

      {/* 2. Event Creation/Editing Form */}
      <button
        onClick={handleCreateNew}
        style={{ margin: "10px 0", padding: "10px" }}
      >
        + Create New Event
      </button>

      {isFormVisible && (
        <div
          style={{
            marginBottom: "20px",
            border: "2px dashed #aaa",
            padding: "15px",
          }}
        >
          <EventForm
            eventToEdit={selectedEvent}
            onFormClose={handleFormClose}
          />
        </div>
      )}
      <hr />

      {/* 3. Event List for Management */}
      <h2>Manage Event Inventory ({events.length})</h2>
      <div className="event-list">
        {events.map((event) => (
          <div
            key={event._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "10px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{event.title}</strong> (
              {new Date(event.date).toLocaleDateString()})
              <br />
              Capacity: {event.capacity} | Price: ${event.price.toFixed(2)}
              {/* NOTE: soldTickets data is needed here for a full admin view, which comes from the Event Model/API */}
            </div>
            <div>
              <button
                onClick={() => handleEdit(event)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                style={{ color: "red" }}
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
