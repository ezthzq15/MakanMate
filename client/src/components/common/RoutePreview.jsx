import React, { useState, useEffect } from 'react';
import { DirectionsRenderer, DirectionsService } from '@react-google-maps/api';

/**
 * COMPONENT: RoutePreview
 * Logic-heavy component to fetch and render walking/driving paths.
 * Integrates with MapContext for active route state.
 */
const RoutePreview = ({ origin, destination, travelMode = 'WALKING', onDurationFound }) => {
  const [response, setResponse] = useState(null);

  const directionsCallback = (res, status) => {
    if (status === 'OK' && res) {
      setResponse(res);
      
      // Extract duration for the UI
      const duration = res.routes[0].legs[0].duration.text;
      const distance = res.routes[0].legs[0].distance.text;
      onDurationFound?.({ duration, distance });
    } else {
      console.error('Directions request failed:', status);
    }
  };

  if (!origin || !destination) return null;

  return (
    <>
      <DirectionsService
        options={{
          origin,
          destination,
          travelMode,
        }}
        callback={directionsCallback}
      />
      {response && (
        <DirectionsRenderer
          options={{
            directions: response,
            suppressMarkers: true, // We use our own markers
            polylineOptions: {
              strokeColor: '#0f4c5c',
              strokeWeight: 5,
              strokeOpacity: 0.7,
            }
          }}
        />
      )}
    </>
  );
};

export default RoutePreview;
