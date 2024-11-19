import { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';
import mIcon from 'leaflet/dist/images/marker-icon.png';
import mShadow from 'leaflet/dist/images/marker-shadow.png';

import { useLeaflet } from '../../context/LeafletProvider';
import { fnMarker } from './Utils';

const Marker = ({
  children,
  latlng = null,
  label = null,
  icon = {},
  markerLayer = null,
  popUp = {},
  ...options
}) => {
  const [preload, setPreload] = useState(true);
  const mapRef = useLeaflet();

  const defaultIcon = typeof mIcon === 'object' ? mIcon?.src : mIcon;
  const defaultShadow = typeof mShadow === 'object' ? mShadow?.src : mShadow;

  const Icon = L.icon({
    iconUrl: icon?.url || defaultIcon,
    shadowUrl: icon?.shadow || defaultShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const setMarker = useCallback(() => {
    if (mapRef.current && preload) {
      setPreload(false);
      const mapLayer = markerLayer || mapRef.current;
      const marker = fnMarker(latlng, {
        icon: Icon,
        label,
        children,
        ...options
      });

      marker.addTo(mapLayer);
    }
  }, [mapRef, preload, Icon, markerLayer, latlng, options, label, children]);

  useEffect(() => {
    setMarker();
  }, [setMarker]);

  return null;
};

export default Marker;
