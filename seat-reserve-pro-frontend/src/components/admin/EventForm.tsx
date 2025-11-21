// seat-reserve-pro-frontend/src/components/admin/EventForm.tsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEvent,
  updateEvent,
  reset,
} from "../../redux/slices/eventsSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import type { Event } from "../../types/Event";

// Initial state for the form
const emptyEvent: Omit<Event, "_id"> = {
  title: "",
  date: new Date().toISOString().substring(0, 16), // Format for datetime-local input
  venue: "",
  capacity: 100,
  price: 10.0,
  description: "",
  seats: [],
  soldTickets: 0,
  isActive: true,
  // Non-editable fields are set on the backend
};

interface EventFormProps {
  eventToEdit: Event | null; // Null for creation, Event object for editing
  onFormClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onFormClose }) => {
  // Determine initial form state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFormState = eventToEdit
    ? {
        ...eventToEdit,
        // Convert Date object to datetime-local string format
        date: new Date(eventToEdit.date).toISOString().substring(0, 16),
      }
    : emptyEvent;

  const [formData, setFormData] = useState(initialFormState);
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, isError, message } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
      dispatch(reset());
    }
    // When eventToEdit changes (e.g., admin selects a different event), update form
    setFormData(initialFormState);
  }, [eventToEdit, isError, message, dispatch, initialFormState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "number" || name === "capacity" || name === "price"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date string back to Date object for API
    const submitData = {
      ...formData,
      date: new Date(formData.date),
    } as unknown as Omit<Event, "_id">;

    if (eventToEdit) {
      // Updating existing event
      dispatch(updateEvent({ id: eventToEdit._id, eventData: submitData }));
    } else {
      // Creating new event
      dispatch(createEvent(submitData));
    }
    onFormClose(); // Close the form after submission
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}
    >
      <h3>{eventToEdit ? "Edit Event" : "Create New Event"}</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="Venue"
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          min="1"
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          step="0.01"
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading
          ? "Processing..."
          : eventToEdit
          ? "Update Event"
          : "Create Event"}
      </button>
      <button
        type="button"
        onClick={onFormClose}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default EventForm;
