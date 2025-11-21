// seat-reserve-pro-frontend/src/App.tsx (Updated)

import { Routes, Route } from "react-router-dom";
// ... (existing imports)
import EventDetail from "./components/attendee/EventDetail"; // <-- NEW IMPORT
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/common/Header";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />{" "}
          {/* <-- ADDED DYNAMIC ROUTE */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Admin Route */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
