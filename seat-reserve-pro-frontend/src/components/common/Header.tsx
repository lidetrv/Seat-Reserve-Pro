// seat-reserve-pro-frontend/src/components/common/Header.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <header
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="logo">
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#333",
            fontSize: "1.5em",
            fontWeight: "bold",
          }}
        >
          Seat Reserve Pro
        </Link>
      </div>
      <nav>
        <Link to="/events" style={{ margin: "0 15px" }}>
          Events
        </Link>
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" style={{ margin: "0 15px", color: "red" }}>
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={onLogout}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ margin: "0 15px" }}>
              Login
            </Link>
            <Link to="/register" style={{ margin: "0 15px" }}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
