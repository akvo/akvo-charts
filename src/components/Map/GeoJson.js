import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';

const GeoJson = ({
  mapKey,
  onClick,
  onMouseOver,
  data = {},
  style = {},
  tooltip = {
    show: false,
    showTooltipForAll: true,
    tooltipComponent: null
  },
  mapData = []
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
              const name = feature?.properties?.[mapKey] || null;
              const findMapData = mapData.find(
                (md) => md?.[mapKey]?.toLowerCase() === name?.toLowerCase()
              );

              if (tooltip?.showTooltipForAll && !tooltip?.tooltipComponent) {
                layer.bindTooltip(name || 'No name', {
                  permanent: false, // Show on hover
                  direction: 'auto'
                });
              }
              if (tooltip?.showTooltipForAll && tooltip?.tooltipComponent) {
                // Render the custom tooltip content using the passed component
                const tooltipElement = document.createElement('div');
                ReactDOM.render(
                  <tooltip.tooltipComponent props={{ name: name }} />,
                  tooltipElement
                );
                // Bind the custom HTML content to the tooltip
                layer.bindTooltip(tooltipElement, {
                  permanent: false,
                  direction: 'auto',
                  className: 'custom-tooltip-wrapper'
                });
              }

              if (
                !tooltip?.showTooltipForAll &&
                !tooltip?.tooltipComponent &&
                findMapData
              ) {
                layer.bindTooltip(name || 'No name', {
                  permanent: false,
                  direction: 'auto'
                });
              }
              if (
                !tooltip?.showTooltipForAll &&
                tooltip?.tooltipComponent &&
                findMapData
              ) {
                const tooltipElement = document.createElement('div');
                ReactDOM.render(
                  <tooltip.tooltipComponent
                    props={{ name: name, ...findMapData }}
                  />,
                  tooltipElement
                );
                // Bind the custom HTML content to the tooltip
                layer.bindTooltip(tooltipElement, {
                  permanent: false,
                  direction: 'auto',
                  className: 'custom-tooltip-wrapper'
                });
              }
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
  }, [
    mapRef,
    layer,
    data,
    style,
    onClick,
    onMouseOver,
    tooltip,
    mapData,
    mapKey
  ]);

  useEffect(() => {
    loadGeoJson();
  }, [loadGeoJson]);

  return null;
};

export default GeoJson;
