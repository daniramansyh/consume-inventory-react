import { createBrowserRouter, Navigate } from "react-router-dom";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";
import StuffIndex from "../pages/stuffs/Index";
import InboundIndex from "../pages/inbounds/Index";
import Login from "../pages/Login";
import ProfilePage from "../pages/Profile"
import AdminRoute from "../pages/middleware/AdminRoute";
import StaffRoute from "../pages/middleware/StaffRoute";
import { Lendings } from "../pages/lendings";
import Data from "../pages/lendings/Data";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("access_token") !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Template /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "profile",
        element: <ProfilePage />
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            path: "stuff",
            element: <StuffIndex />
          },
          {
            path: "inbound",
            element: <InboundIndex />
          }
        ]
      },
      {
        path: "staff",
        element: <StaffRoute />,
        children: [
          { path: "lending", element: <Lendings />},
          { path: "lending/data", element: <Data />}
        ]
      }
    ]
  }
]);