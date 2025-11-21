// seat-reserve-pro-frontend/src/pages/HomePage.tsx

import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div
      className="home-page-container"
      style={{
        textAlign: "center",
        padding: "50px 20px",
        backgroundColor: "#f4f7f6",
      }}
    >
      <h1 style={{ color: "#007bff", fontSize: "3em" }}>
        Welcome to Seat Reserve Pro
      </h1>
      <p style={{ fontSize: "1.2em", color: "#555" }}>
        Your comprehensive solution for seamless event management and real-time
        ticket booking.
      </p>
      <div style={{ margin: "30px 0" }}>
        <Link
          to="/events"
          style={{
            padding: "12px 25px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "1.1em",
            marginRight: "15px",
          }}
        >
          Browse Events
        </Link>
        <Link
          to="/login"
          style={{
            padding: "12px 25px",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "1.1em",
          }}
        >
          Login / Admin Access
        </Link>
      </div>
      <div
        style={{
          marginTop: "50px",
          borderTop: "1px solid #ccc",
          paddingTop: "20px",
        }}
      >
        <h2>Core Features</h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          <li>✅ Real-Time Seat Availability</li>
          <li>🔒 Role-Based Security</li>
          <li>💳 Simulated Payments</li>
          <li>📊 Admin Analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
