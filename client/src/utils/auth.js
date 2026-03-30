export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Clear user info too if exists
  // Force a full page reload and replace the top history entry to block back button
  window.location.replace('/auth/login');
};

export const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.userRole || null;
  } catch (e) {
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      'Content-Type': 'application/json'
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
