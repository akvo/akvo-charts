import { useEffect } from 'react';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';

const GeoJson = ({ onClick, onMouseOver, data = {}, style = {} }) => {
  const mapRef = useLeaflet();
  useEffect(() => {
    if (mapRef.current && data?.type && data?.type !== 'Topology') {
      try {
        L.geoJSON(data, {
          style: (feature) =>
            typeof style === 'function'
              ? style(feature)
              : {
                  ...style,
                  fillOpacity: parseFloat(style?.fillOpacity || 0.2, 10)
                },
          onEachFeature: (_, layer) => {
            if (typeof onClick === 'function') {
              layer.on({
                click: (props) => {
                  onClick(props);
                }
              });
            }

            if (typeof onMouseOver === 'function') {
              layer.on({
                mouseover: (props) => {
                  onMouseOver(props);
                }
              });
            }
          }
        }).addTo(mapRef.current);
      } catch (err) {
        console.error('GeoJson', err);
      }
    }
  }, [mapRef, data, style, onClick, onMouseOver]);

  return null;
};

export default GeoJson;
