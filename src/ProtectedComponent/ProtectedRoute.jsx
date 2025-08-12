import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("employeROyalmadeLogin");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
  