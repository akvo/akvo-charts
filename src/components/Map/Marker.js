import { useCallback, useEffect, useState } from 'react';
import { useLeaflet } from '../../context/LeafletProvider';
import { fnMarker } from './Utils';

const Marker = ({
  children,
  latlng = null,
  label = null,
  markerLayer = null,
  ...options
}) => {
  const [preload, setPreload] = useState(true);
  const mapRef = useLeaflet();

  const setMarker = useCallback(() => {
    if (mapRef.current && preload) {
      setPreload(false);
      const mapLayer = markerLayer || mapRef.current;
      const marker = fnMarker(latlng, {
        label,
        children,
        ...options
      });

      marker.addTo(mapLayer);
    }
  }, [mapRef, preload, markerLayer, latlng, options, label, children]);

  useEffect(() => {
    setMarker();
  }, [setMarker]);

  return null;
};

export default Marker;
