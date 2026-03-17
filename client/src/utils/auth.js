/**
 * Retrieves the Firebase ID token from localStorage and formats it
 * into headers required for authenticated backend requests.
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Return empty or default headers if no token exists
    return {
      'Content-Type': 'application/json'
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
