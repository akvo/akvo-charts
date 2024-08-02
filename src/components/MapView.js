// src/MapView.js
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import L from 'leaflet';
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

const MapView = forwardRef(({ data = [], config = {}, layers = [] }, ref) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      const mapLayers = layers?.map((ly) => {
        const { tile, ...lyProps } = ly;
        return L.tileLayer(tile, { ...lyProps });
      });

      const markers = data?.map((d) =>
        L.marker(d?.point, { icon: defaultIcon }).bindPopup(d?.label)
      );

      const places = L.layerGroup(markers);
      // Initialize the map only if it hasn't been initialized yet
      const map = L.map(mapContainerRef.current, {
        center: config?.center || [0, 0],
        zoom: config?.zoom || 2,
        layers: [...mapLayers, places]
      });

      // Save the map instance to ref
      mapInstanceRef.current = map;
    }

    // Cleanup function to remove map instance on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, config, layers]);

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
      style={{ height: '100vh', width: '100%' }}
      data-testid="map-view"
    />
  );
});

export default MapView;
