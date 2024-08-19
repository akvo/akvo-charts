import { useCallback, useEffect, useRef } from 'react';
import L from 'leaflet';

import { useLeaflet } from '../../context/LeafletProvider';
import { calculateRanges } from '../../utils/mapHelper';
import styles from '../../styles.module.css';

const LegendControl = ({ data = [], color = [] }) => {
  const mapRef = useLeaflet();
  const legendRef = useRef(null);

  const loadLegend = useCallback(() => {
    if (mapRef?.current && !legendRef?.current) {
      legendRef.current = L.control({ position: 'bottomright' });
    }

    if (legendRef?.current && mapRef?.current) {
      mapRef.current.removeControl(legendRef.current);

      legendRef.current.onAdd = () => {
        const div = L.DomUtil.create('div', styles.legend);
        const grades = calculateRanges(data, color.length);
        grades.forEach((g, gx) => {
          const [min, max] = g;
          div.innerHTML += `<span class="icon" style="background-color: ${color?.[gx]};"></span> ${min} - ${max} <br/>`;
        });
        return div;
      };

      legendRef.current.addTo(mapRef.current);
    }
  }, [mapRef, legendRef, data, color]);

  useEffect(() => {
    loadLegend();
  }, [loadLegend]);

  return null;
};

export default LegendControl;
