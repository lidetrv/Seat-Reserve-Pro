// seat-reserve-pro-frontend/src/pages/LoginPage.tsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store"; // Use 'type' for strictness

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Select state from Redux
  const { user, isLoading, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  // Effect to handle navigation and cleanup after auth attempt
  useEffect(() => {
    if (isError) {
      alert(`Error: ${message}`);
    }

    // Redirect when logged in (user present)
    if (user) {
      // Redirect based on role if needed, otherwise just to home
      const destination = user.role === "admin" ? "/admin" : "/events";
      navigate(destination);
    }

    // Clean up the state
    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = { email, password };

    // Dispatch the login action to Redux
    dispatch(login(userData));
  };

  if (isLoading) {
    return <h2 style={{ padding: "20px", textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>🔑 Login to Seat Reserve Pro</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
