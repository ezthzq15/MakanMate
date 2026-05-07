import { useMemo } from 'react';

/**
 * HOOK: useMapMarkers
 * Normalizes stall data from backend to ensure consistent coordinate structures.
 * Filters out entries with invalid or missing GPS data.
 */
export const useMapMarkers = (stalls = []) => {
  const markers = useMemo(() => {
    if (!Array.isArray(stalls)) return [];

    return stalls
      .map((stall) => {
        // Handle different coordinate structures (flat vs nested)
        const lat = parseFloat(stall.latitude || (stall.location && stall.location.lat));
        const lng = parseFloat(stall.longitude || (stall.location && stall.location.lng));

        if (isNaN(lat) || isNaN(lng)) return null;

        return {
          ...stall,
          position: { lat, lng },
        };
      })
      .filter((marker) => marker !== null);
  }, [stalls]);

  return markers;
};

export default useMapMarkers;
