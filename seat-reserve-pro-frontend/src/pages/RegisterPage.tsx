// seat-reserve-pro-frontend/src/pages/RegisterPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../redux/slices/authSlice"; // Use the new register thunk
import type { RootState, AppDispatch } from "../redux/store";
import { register } from "../redux/slices/authSlice"; // Use the new register thunk

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "", // For confirmation
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate("/events");
    }
    if (isError) {
      alert(message);
      dispatch(reset());
    }
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match");
    } else {
      // Note: The payload must match the expected fields in the register thunk
      dispatch(register({ name, email, password }));
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="register-container">
      <h2>Create Your Seat Reserve Pro Account</h2>
      <p>Sign up to book your next event</p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your name"
            required
          />
        </div>
        {/* ... (email, password, password2 inputs are similar to login) ... */}
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter password"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            placeholder="Confirm password"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
      <p>
        Already have an account? <Link to="/login">Login Here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
