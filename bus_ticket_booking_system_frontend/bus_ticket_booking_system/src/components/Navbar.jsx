import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

  const logout = () => {
    ["token", "name", "userId", "role", "selectedBus", "selectedSeats", "ticket"].forEach(
      (key) => localStorage.removeItem(key),
    );
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to={isAdmin ? "/admin" : "/dashboard"}>
          Bus<span>Go</span>
        </Link>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {!isAdmin && (
            <>
              <Link className="btn btn-light" to="/dashboard">🏠 Home</Link>
              <Link className="btn btn-outline-light" to="/search">🔍 Search</Link>
              <Link className="btn btn-warning" to="/bookings">🎫 My Bookings</Link>
            </>
          )}

          {isAdmin && (
            <Link className="btn btn-info" to="/admin">⚙️ Admin Panel</Link>
          )}

          <button className="btn btn-danger" onClick={logout}>
            ⏻ Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
