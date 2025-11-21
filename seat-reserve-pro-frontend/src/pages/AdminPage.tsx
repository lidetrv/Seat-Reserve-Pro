// seat-reserve-pro-frontend/src/pages/AdminPage.tsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import AdminDashboard from "../components/admin/AdminDashboard"; // Renders the actual dashboard logic
// import PrivateRoute from '../components/common/PrivateRoute'; // Assuming you'd use this wrapper later

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  // Manual protection check (better done with a PrivateRoute wrapper component)
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      alert("Access Denied: You must be an administrator to view this page.");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <h2>Checking permissions...</h2>;
  }

  if (!user || user.role !== "admin") {
    return null; // Don't render anything if redirection is pending
  }

  return (
    <div className="admin-page-container" style={{ padding: "20px" }}>
      <h1>Admin Control Dashboard 👑</h1>
      <p>
        Welcome, **{user.name}**! Manage events and view sales analytics here.
      </p>
      <hr />
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
