import React from "react";
import type { Event } from "../../types/Event";

interface SalesChartProps {
  events: Event[];
}

const SalesChart: React.FC<SalesChartProps> = ({ events }) => {
  // Calculate some basic statistics
  const totalRevenue = events.reduce((sum, event) => {
    // Assuming you have soldTickets property on your Event type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const soldTickets = (event as any).soldTickets ?? 0;
    return sum + soldTickets * event.price;
  }, 0);

  const totalTicketsSold = events.reduce((sum, event) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sum + ((event as any).soldTickets ?? 0);
  }, 0);

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}
    >
      <h3>Sales Analytics</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div
          style={{
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}
        </div>
        <div
          style={{
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Total Tickets Sold:</strong> {totalTicketsSold}
        </div>
        <div
          style={{
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Active Events:</strong> {events.length}
        </div>
      </div>
      <p style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
        Note: Add your chart library (like Chart.js, Recharts, etc.) here for
        visualizations
      </p>
    </div>
  );
};

export default SalesChart;
