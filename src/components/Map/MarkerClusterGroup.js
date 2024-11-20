import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useLeaflet } from '../../context/LeafletProvider';
import { fnMarker } from './Utils';

const MarkerClusterGroup = ({
  children,
  iconCreateFn,
  onClick,
  onMarkerClick,
  ...props
}) => {
  const [preload, setPreload] = useState(true);

  const mapRef = useLeaflet();
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    if (preload && mapRef.current) {
      setPreload(false);

      // Initialize marker cluster group
      const clusterGroup = L.markerClusterGroup({
        ...props,
        iconCreateFunction:
          typeof iconCreateFn === 'function'
            ? (cluster) => {
                const divIcon = iconCreateFn(cluster);
                if (divIcon?.iconSize) {
                  Object.assign(divIcon, {
                    iconSize: L.point(divIcon.iconSize, divIcon.iconSize, true)
                  });
                }
                return L.divIcon(divIcon);
              }
            : null
      }).addTo(mapRef.current);

      clusterGroupRef.current = clusterGroup;

      // Add click handler
      if (typeof onMarkerClick === 'function') {
        clusterGroup.on('click', (e) => onMarkerClick(e));
      }

      if (typeof onClick === 'function') {
        clusterGroup.on('clusterclick', (e) => onClick(e));
      }
    }
  }, [iconCreateFn, props, onMarkerClick, onClick, mapRef, preload]);

  // Add markers as children
  useEffect(() => {
    if (clusterGroupRef.current) {
      const markers = React.Children.map(children, (child) => {
        if (child && child.props.latlng) {
          const { latlng, ...childProps } = child.props;
          const m = fnMarker(latlng, childProps);
          return m;
        }
        return null;
      });

      // Add valid markers to the cluster group
      if (markers) {
        clusterGroupRef.current.refreshClusters();
        clusterGroupRef.current.addLayers(markers.filter(Boolean));
        mapRef.current.fitBounds(clusterGroupRef.current.getBounds());
      }
    }

    return () => {
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
      }
    };
  }, [children, mapRef]);

  return null; // This component does not render any DOM directly
};

export default MarkerClusterGroup;
