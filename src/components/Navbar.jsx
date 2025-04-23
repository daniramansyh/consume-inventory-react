import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  let navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access_token") !== null;

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Inventaris
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link active">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link active">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/stuffs" className="nav-link active">
                    Stuffs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/inbounds" className="nav-link active">
                    Inbound
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link active" onClick={logoutHandler}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link active">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
