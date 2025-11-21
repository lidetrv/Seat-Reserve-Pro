// seat-reserve-pro-frontend/src/components/attendee/SeatMap.tsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Event } from "../../types/Event";
import { toggleSeatSelection } from "../../redux/slices/bookingSlice";
import type { RootState, AppDispatch } from "../../redux/store";

interface SeatMapProps {
  event: Event;
}

const SeatMap: React.FC<SeatMapProps> = ({ event }) => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedSeatIds } = useSelector((state: RootState) => state.booking);

  if (!event.seats || event.seats.length === 0) {
    return <p>Seating information unavailable.</p>;
  }

  const handleSeatClick = (seatId: string, isBooked: boolean) => {
    if (!isBooked) {
      dispatch(toggleSeatSelection(seatId));
    }
  };

  return (
    <div
      className="seat-map-visual"
      style={{
        border: "2px solid #333",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h4>STAGE</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {event.seats.map((seat) => {
          const isSelected = selectedSeatIds.includes(seat.seatId);
          const isBooked = seat.isBooked;

          let color = "#ccc"; // Available
          if (isBooked) color = "#f00"; // Booked/Unavailable
          if (isSelected) color = "#00f"; // Selected

          return (
            <div
              key={seat.seatId}
              onClick={() => handleSeatClick(seat.seatId, isBooked)}
              title={
                isBooked
                  ? `Booked by: ${seat.bookedBy}`
                  : `Price: $${event.price.toFixed(2)}`
              }
              style={{
                width: "30px",
                height: "30px",
                lineHeight: "30px",
                backgroundColor: color,
                color: "white",
                borderRadius: "5px",
                cursor: isBooked ? "not-allowed" : "pointer",
                opacity: isBooked ? 0.6 : 1,
                transition: "0.2s",
                fontWeight: "bold",
                border: isSelected ? "3px solid gold" : "none",
              }}
            >
              {seat.seatId.substring(1)}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <span style={{ color: "#ccc" }}>Available</span>
        <span style={{ color: "#f00" }}>Booked</span>
        <span style={{ color: "#00f" }}>Selected</span>
      </div>
    </div>
  );
};

export default SeatMap;
