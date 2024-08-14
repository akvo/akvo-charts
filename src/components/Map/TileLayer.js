import { useEffect } from 'react';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';

const TileLayer = ({ url, ...props }) => {
  const mapRef = useLeaflet();

  useEffect(() => {
    if (mapRef.current) {
      if (url) {
        L.tileLayer(url, { ...props }).addTo(mapRef.current);
      }
    }
  }, [mapRef, props, url]);

  return null;
};

export default TileLayer;
