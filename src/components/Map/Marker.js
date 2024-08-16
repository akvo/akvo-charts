import { useEffect } from 'react';
import L from 'leaflet';
import mIcon from 'leaflet/dist/images/marker-icon.png';
import mShadow from 'leaflet/dist/images/marker-shadow.png';

import { useLeaflet } from '../../context/LeafletProvider';

const Marker = ({
  latlng = null,
  label = null,
  icon = {},
  markerLayer,
  ...options
}) => {
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

  useEffect(() => {
    if (mapRef.current) {
      const mapLayer = markerLayer || mapRef.current;
      const marker = L.marker(latlng, { icon: Icon, ...options }).addTo(
        mapLayer
      );
      if (label) {
        marker.bindPopup(label);
      }
    }
  }, [Icon, mapRef, label, latlng, options, markerLayer]);

  return null;
};

export default Marker;
