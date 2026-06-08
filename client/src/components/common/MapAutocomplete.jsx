import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

/**
 * COMPONENT: MapAutocomplete
 * A robust search box that fetches suggestions from OpenStreetMap Nominatim.
 * Fully functional even if Google Places API is blocked or has billing errors.
 */
const MapAutocomplete = ({ onPlaceSelected, placeholder = "Search for a location...", ...props }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placesMap, setPlacesMap] = useState({});

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=my`
        );
        const data = await res.json();
        if (data && Array.isArray(data)) {
          const names = [];
          const newMap = {};
          data.forEach((item) => {
            const label = item.display_name;
            names.push(label);
            newMap[label] = {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.display_name,
              name: item.name || item.display_name
            };
          });
          setSuggestions(names);
          setPlacesMap(newMap);
        }
      } catch (err) {
        console.error('Nominatim autocomplete search failed', err);
      }
    }, 400); // 400ms debounce to prevent hitting rate limits

    return () => clearTimeout(delayDebounce);
  }, [value]);

  const handleOptionSubmit = (val) => {
    const matched = placesMap[val];
    if (matched) {
      onPlaceSelected(matched);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = value;
      if (!query) return;

      // If there's an exact match in suggestions
      if (placesMap[query]) {
        onPlaceSelected(placesMap[query]);
        return;
      }

      // Otherwise, query one result immediately
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=my`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const first = data[0];
          onPlaceSelected({
            lat: parseFloat(first.lat),
            lng: parseFloat(first.lon),
            address: first.display_name,
            name: first.name || first.display_name
          });
        }
      } catch (err) {
        console.error('Nominatim direct search failed', err);
      }
    }
  };

  return (
    <Autocomplete
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      radius="md"
      data={suggestions}
      value={value}
      onChange={(val) => {
        setValue(val);
        if (props.onChange) {
          props.onChange(val);
        }
      }}
      onOptionSubmit={handleOptionSubmit}
      onKeyDown={(e) => {
        handleKeyDown(e);
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }}
      {...props}
    />
  );
};

export default MapAutocomplete;
