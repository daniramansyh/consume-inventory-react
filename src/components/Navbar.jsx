import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar() {
  let navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access_token") !== null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow p-0">
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand d-flex align-items-center py-2">
          <i className="bi bi-box-seam me-2"></i>
          Inventaris
        </Link>
        <button
          className="navbar-toggler border-0"
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
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link to="/dashboard" className="nav-link px-3 py-2">
                        <i className="bi bi-speedometer2 me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/stuff" className="nav-link px-3 py-2">
                        <i className="bi bi-card-list me-1"></i>
                        Stuffs
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/inbound" className="nav-link px-3 py-2">
                        <i className="bi bi-box-arrow-in me-1"></i>
                        Inbounds
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'staff' && (
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle px-3 py-2 btn btn-link"
                      type="button"
                      id="lendingDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="bi bi-box-arrow-in me-1"></i>
                      Lendings
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="lendingDropdown">
                      <li>
                        <Link to="/dashboard/staff/lending" className="dropdown-item">
                          <i className="bi bi-plus-circle me-2"></i>New
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/staff/lending/data" className="dropdown-item">
                          <i className="bi bi-table me-2"></i>Data
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link px-3 py-2"
                    onClick={logoutHandler}
                    style={{ border: 'none' }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link px-3 py-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
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