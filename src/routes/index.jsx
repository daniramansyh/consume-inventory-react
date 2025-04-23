import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Template from "../layouts/Template";
import Dashboard from "../pages/Dashboard";
import PrivatePage from "../pages/middleware/PrivatePage";
import GuestPage from "../pages/middleware/GuestPage";
import StuffIndex from "../pages/stuffs/index";
import InboundIndex from "../pages/inbounds/index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      { 
        path: "/", 
        element: <App /> 
      },
      { 
        path: "/login", 
        element: <GuestPage />,
        children : [
          {path: "/login", element: <Login />},
        ] 
      },
      {
        element: <PrivatePage />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "dashboard", element: <Dashboard />},
          { path: "stuffs", element: <StuffIndex /> },
          { path: "inbounds", element: <InboundIndex /> }, 
        ]
      }
    ],
  },
]);
