import { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';

const GeoJson = ({ onClick, onMouseOver, data = {}, style = {} }) => {
  const [layer, setLayer] = useState(null);
  const mapRef = useLeaflet();

  const loadGeoJson = useCallback(() => {
    if (mapRef.current && data?.type && data?.type !== 'Topology' && !layer) {
      try {
        const gl = L.geoJSON(data, {
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
        });
        setLayer(gl);
        gl.addTo(mapRef.current);
      } catch (err) {
        console.error('GeoJson', err);
      }
    }
    if (layer) {
      layer.resetStyle();
      layer.setStyle((feature) =>
        typeof style === 'function'
          ? style(feature)
          : {
              ...style,
              fillOpacity: parseFloat(style?.fillOpacity || 0.2, 10)
            }
      );
    }
  }, [mapRef, layer, data, style, onClick, onMouseOver]);

  useEffect(() => {
    loadGeoJson();
  }, [loadGeoJson]);

  return null;
};

export default GeoJson;
