import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

/**
 * Strict Protected Route Guard
 * Redirects to login if user is not authenticated.
 * Saves the attempted URL to redirect back after login.
 */
export const ProtectedRoute = () => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    // We use Navigate instead of window.location to keep it within the React Router context
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * Role-Based Access Guard
 * Redirects to 404/Unauthorized if user doesn't have the required role.
 */
export const RoleGuard = ({ allowedRoles }) => {
  const role = getUserRole();
  const isAuth = isAuthenticated();

  if (!isAuth) return <Navigate to="/auth/login" replace />;
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

/**
 * Public Only Route Guard
 * Prevents authenticated users from accessing login/signup pages.
 * Redirects them to their respective dashboards.
 */
export const PublicOnlyRoute = () => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (isAuth) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'StallManager') return <Navigate to="/stall/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
