// src/MapView.js
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback
} from 'react';
import L from 'leaflet';
import * as topojson from 'topojson-client';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the default icon for markers
const defaultIcon = L.icon({
  iconUrl: typeof markerIcon === 'object' ? markerIcon?.src : markerIcon,
  shadowUrl:
    typeof markerShadow === 'object' ? markerShadow?.src : markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getObjectFromString = (path) => {
  const obj = path.split('.').reduce((obj, key) => obj && obj[key], window);
  if (typeof obj === 'undefined' || typeof obj === 'string') {
    return null;
  }
  return obj;
};

const MapView = forwardRef(({ tile, layer, config, data = [] }, ref) => {
  const [geoData, setGeoData] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const loadGeoDataFromURL = useCallback(async () => {
    if (layer?.url && !geoData) {
      try {
        const res = await fetch(layer.url);
        const apiData = await res.json();
        if (apiData) {
          setGeoData(apiData);
        }
      } catch (err) {
        console.error('loadGeoDataFromURL', err);
      }
    }
  }, [layer.url, geoData]);

  useEffect(() => {
    loadGeoDataFromURL();
  }, [loadGeoDataFromURL]);

  useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      // Initialize the map only if it hasn't been initialized yet
      const map = L.map(mapContainerRef.current, {
        center: config?.center || [0, 0],
        zoom: config?.zoom || 2
      });

      // Save the map instance to ref
      mapInstanceRef.current = map;

      // Add a tile layer to the map
      if (tile?.url) {
        const { url: tileURL, ...tileProps } = tile;
        L.tileLayer(tileURL, { ...tileProps }).addTo(map);
      }

      // Add a marker to the map
      data
        ?.filter((d) => d?.point && d?.label)
        ?.forEach((d) =>
          L.marker(d?.point, { icon: defaultIcon })
            .bindPopup(d?.label)
            .addTo(map)
        );
      // Create the TopoJSON layer
      const TopoJSON = L.GeoJSON.extend({
        addData: (d) => {
          if (d?.type === 'Topology') {
            for (let kd in d.objects) {
              if (d.objects.hasOwnProperty(kd)) {
                const geojson = topojson.feature(d, d.objects[kd]);
                L.geoJSON(geojson, { style: () => layer?.style || {} }).addTo(
                  map
                );
              }
            }
          }
          // Make sure `d` is an object that has a type but is not equal to "Topology"
          if (d?.type && d?.type !== 'Topology') {
            L.geoJSON(d, { style: () => layer?.style || {} }).addTo(map);
          }
        }
      });

      L.topoJson = function (d, options) {
        return new TopoJSON(d, options);
      };

      // Create an empty GeoJSON layer with a style and a popup on click
      const geojsonLayer = L.topoJson(null).addTo(map);

      try {
        // Set GeoJSON when source is string as window variable name
        if (
          typeof layer?.source === 'string' &&
          layer?.source?.includes('window')
        ) {
          const topoData = getObjectFromString(layer.source);
          if (topoData) {
            geojsonLayer.addData(topoData);
          }
        }
        // Set GeoJSON directly if the source is an object
        if (typeof layer?.source === 'object') {
          geojsonLayer.addData(layer.source);
        }
      } catch (err) {
        console.error('geojsonLayer', err);
      }

      if (geoData) {
        geojsonLayer.addData(geoData);
      }
    }

    // Cleanup function to remove map instance on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    config?.center,
    config?.zoom,
    data,
    layer.source,
    layer?.style,
    layer.url,
    tile,
    geoData
  ]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomIn();
      }
    },
    zoomOut: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomOut();
      }
    },
    getCenter: () => {
      if (mapInstanceRef.current) {
        return mapInstanceRef.current.getCenter();
      }
      return null;
    }
  }));

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: config?.height || '100vh',
        width: config?.width || '100%'
      }}
      data-testid="map-view"
    />
  );
});

export default MapView;
