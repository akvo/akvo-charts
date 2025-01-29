import { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';

const GeoJson = ({
  mapKey,
  onClick,
  onMouseOver,
  data = {},
  style = {},
  tooltip = { show: false }
}) => {
  const [layer, setLayer] = useState(null);
  const mapRef = useLeaflet();

  const loadGeoJson = useCallback(() => {
    if (mapRef.current && data?.type && data?.type !== 'Topology' && !layer) {
      try {
        const gl = L.geoJSON(data, {
          onEachFeature: (feature, layer) => {
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

            if (tooltip?.show) {
              console.log(feature?.properties, 'aa', mapKey);
              layer.bindTooltip(feature?.properties?.[mapKey] || 'No name', {
                permanent: false, // Show on hover
                direction: 'auto'
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
