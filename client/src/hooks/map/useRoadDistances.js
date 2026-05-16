import { useState, useEffect } from 'react';
import useGoogleMapsLoader from './useGoogleMapsLoader';

export const useRoadDistances = (origin, stalls) => {
  const { isLoaded } = useGoogleMapsLoader();
  const [roadDistances, setRoadDistances] = useState({});

  useEffect(() => {
    if (!isLoaded || !window.google || !origin || !stalls || stalls.length === 0) return;

    // Filter stalls that have valid coordinates and we haven't already calculated distance for
    const stallsToCalculate = stalls.filter(
      s => s.location && s.location.lat && s.location.lng && roadDistances[s.id] === undefined
    );

    if (stallsToCalculate.length === 0) return;

    // Distance Matrix API has a limit of 25 destinations per request
    // Since we usually paginate by 10-12, this is fine
    const destinations = stallsToCalculate.map(s => ({
      lat: s.location.lat,
      lng: s.location.lng
    }));

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins: [origin],
      destinations: destinations,
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK' && response.rows[0]) {
        const elements = response.rows[0].elements;
        const newDistances = { ...roadDistances };
        
        stallsToCalculate.forEach((stall, idx) => {
          if (elements[idx] && elements[idx].status === 'OK') {
            // distance value is in meters, convert to km
            newDistances[stall.id] = elements[idx].distance.value / 1000;
          }
        });
        
        setRoadDistances(newDistances);
      }
    });
  }, [isLoaded, origin, stalls]); // Only re-run if these change

  // Return a new array of stalls with the road distances applied
  return stalls.map(stall => ({
    ...stall,
    distance: roadDistances[stall.id] !== undefined ? roadDistances[stall.id] : stall.distance
  }));
};

export default useRoadDistances;
