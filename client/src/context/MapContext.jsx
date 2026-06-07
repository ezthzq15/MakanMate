import React, { createContext, useContext, useState, useMemo } from 'react';
import { useUserLocation } from '../hooks/map/useUserLocation';

/**
 * CONTEXT: MapContext
 * Centralized state management for all map-related features.
 * Prevents prop-drilling and ensures consistent GPS/Map state.
 */

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  // 1. User Location State (GPS)
  const { 
    lat: userLat, 
    lng: userLng, 
    accuracy, 
    loading: geoLoading, 
    error: geoError,
    refresh: refreshLocation 
  } = useUserLocation({ watch: false });

  // 2. Map View State
  const [mapCenter, setMapCenter] = useState({ lat: 5.4141, lng: 100.3288 }); // Default to Penang
  const [zoom, setZoom] = useState(13);
  
  // 3. Selection State
  const [selectedStall, setSelectedStall] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null); // For Directions

  // 4. Fallback Logic: Update center when user location is first found
  React.useEffect(() => {
    if (userLat && userLng) {
      setMapCenter({ lat: userLat, lng: userLng });
    }
  }, [userLat, userLng]);

  const value = useMemo(() => ({
    userLocation: { lat: userLat, lng: userLng, accuracy },
    geoLoading,
    geoError,
    refreshLocation,
    
    mapCenter,
    setMapCenter,
    zoom,
    setZoom,
    
    selectedStall,
    setSelectedStall,
    
    activeRoute,
    setActiveRoute,
  }), [userLat, userLng, accuracy, geoLoading, geoError, mapCenter, zoom, selectedStall, activeRoute]);

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
