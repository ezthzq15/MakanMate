import { useJsApiLoader } from '@react-google-maps/api';

/**
 * HOOK: useGoogleMapsLoader
 * Centralized loader for the Google Maps JavaScript API.
 * Ensures the script is loaded exactly once across the application.
 */
const libraries = ['places', 'geometry']; // Essential libraries for search and distance

export const useGoogleMapsLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    // Using import.meta.env for Vite compatibility
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return { isLoaded, loadError };
};

export default useGoogleMapsLoader;
