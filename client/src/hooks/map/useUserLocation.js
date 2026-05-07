import { useState, useEffect, useCallback } from 'react';

/**
 * HOOK: useUserLocation
 * Manages real-time or one-time user geolocation using the browser API.
 * Handles permissions, errors, and loading states.
 */
export const useUserLocation = (options = { watch: false }) => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSuccess = (position) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setLoading(false);
    setError(null);
  };

  const handleError = (err) => {
    let message = 'An unknown error occurred while retrieving location.';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'User denied the request for Geolocation.';
        break;
      case err.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case err.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      default:
        break;
    }
    setError(message);
    setLoading(false);
  };

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    setLoading(true);
    if (options.watch) {
      const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      return () => navigator.geolocation.clearWatch(id);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    }
  }, [options.watch]);

  useEffect(() => {
    const cleanup = getLocation();
    return () => cleanup && cleanup();
  }, [getLocation]);

  return { ...location, loading, error, refresh: getLocation };
};

export default useUserLocation;
