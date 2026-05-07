import React from 'react';
import { MarkerF, CircleF } from '@react-google-maps/api';

/**
 * COMPONENT: UserLocationMarker
 * Displays the blue dot representing the user's current GPS position.
 * Includes an accuracy circle.
 */
const UserLocationMarker = ({ position, accuracy }) => {
  if (!position || !position.lat || !position.lng) return null;

  return (
    <>
      {/* Accuracy Circle */}
      {accuracy && (
        <CircleF
          center={position}
          radius={accuracy}
          options={{
            fillColor: '#4285F4',
            fillOpacity: 0.15,
            strokeColor: '#4285F4',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            clickable: false,
          }}
        />
      )}

      {/* Pulsing Blue Dot (Standard Marker for now) */}
      <MarkerF
        position={position}
        icon={{
          path: window.google?.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        }}
        zIndex={100}
      />
    </>
  );
};

export default UserLocationMarker;
