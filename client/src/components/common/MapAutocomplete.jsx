import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

// Penang bounding box for Photon location bias
const PENANG_BBOX = '100.1652,5.1244,100.5618,5.5634'; // lon_min,lat_min,lon_max,lat_max

/**
 * Shorten a long Photon display name to the first 2–3 meaningful parts.
 * e.g. "Jalan Penang, George Town, Penang Island, Penang, 10000, Malaysia"
 *   → "Jalan Penang, George Town, Penang"
 */
const shortenLabel = (props) => {
  const parts = [
    props.name,
    props.street,
    props.suburb || props.neighbourhood,
    props.city || props.town || props.village,
    props.county || props.state,
  ].filter(Boolean);
  // Deduplicate consecutive identical parts
  const unique = parts.filter((p, i) => p !== parts[i - 1]);
  return unique.slice(0, 4).join(', ');
};

/**
 * COMPONENT: MapAutocomplete
 * Search box with Photon geocoder suggestions (OpenStreetMap-based, CORS-friendly,
 * faster than Nominatim, biased to Penang).
 */
const MapAutocomplete = ({ onPlaceSelected, placeholder = 'Search for a location...', ...props }) => {
  const [value, setValue]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placesMap, setPlacesMap] = useState({});
  const [loading, setLoading]     = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        // Photon: fast, CORS-enabled, OpenStreetMap-powered geocoder by Komoot
        // bbox biases results toward Penang; lang=en for English names
        const url =
          `https://photon.komoot.io/api/?q=${encodeURIComponent(value.trim())}` +
          `&limit=6&lang=en&bbox=${PENANG_BBOX}`;

        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (data?.features?.length) {
          const names  = [];
          const newMap = {};

          data.features.forEach((feat) => {
            const p     = feat.properties || {};
            const coord = feat.geometry?.coordinates; // [lon, lat]
            if (!coord) return;

            const label = shortenLabel(p) || p.name || 'Unknown';
            // Avoid duplicates
            if (newMap[label]) return;
            names.push(label);
            newMap[label] = {
              lat:     coord[1],
              lng:     coord[0],
              address: label,
              name:    p.name || label,
            };
          });

          setSuggestions(names);
          setPlacesMap(newMap);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Photon autocomplete failed:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value]);

  const handleOptionSubmit = (val) => {
    const matched = placesMap[val];
    if (matched && onPlaceSelected) {
      setValue(val);
      onPlaceSelected(matched);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = value.trim();
      if (!query) return;

      // Exact match already in map
      if (placesMap[query]) {
        onPlaceSelected(placesMap[query]);
        return;
      }

      // First suggestion wins
      const firstKey = Object.keys(placesMap)[0];
      if (firstKey) {
        onPlaceSelected(placesMap[firstKey]);
        setValue(firstKey);
        return;
      }

      // Last-resort: one direct Photon lookup
      try {
        setLoading(true);
        const res  = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=en&bbox=${PENANG_BBOX}`
        );
        const data = await res.json();
        if (data?.features?.length) {
          const feat  = data.features[0];
          const coord = feat.geometry?.coordinates;
          const p     = feat.properties || {};
          if (coord && onPlaceSelected) {
            onPlaceSelected({
              lat:     coord[1],
              lng:     coord[0],
              address: shortenLabel(p) || p.name || query,
              name:    p.name || query,
            });
          }
        }
      } catch (err) {
        console.error('Photon direct search failed:', err);
      } finally {
        setLoading(false);
      }
    }

    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <Autocomplete
      placeholder={placeholder}
      leftSection={loading ? <Loader size={16} color="gray" /> : <IconSearch size={16} />}
      radius="md"
      data={suggestions}
      value={value}
      onChange={(val) => {
        setValue(val);
        if (props.onChange) props.onChange(val);
      }}
      onOptionSubmit={handleOptionSubmit}
      onKeyDown={handleKeyDown}
      comboboxProps={{ shadow: 'md', withinPortal: true }}
      maxDropdownHeight={300}
      {...props}
    />
  );
};

export default MapAutocomplete;
