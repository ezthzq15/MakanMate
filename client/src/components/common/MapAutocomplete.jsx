import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

/**
 * COMPONENT: MapAutocomplete
 * A reusable search box for finding locations via Google Places API.
 * Integrates with @react-google-maps/api and Mantine UI.
 */
const MapAutocomplete = ({ onPlaceSelected, placeholder = "Search for a location...", ...props }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (auto) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
          name: place.name
        };
        onPlaceSelected(location);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    >
      <TextInput
        placeholder={placeholder}
        leftSection={<IconSearch size={16} />}
        radius="md"
        {...props}
      />
    </Autocomplete>
  );
};

export default MapAutocomplete;
