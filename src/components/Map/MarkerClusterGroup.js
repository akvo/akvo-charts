import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useLeaflet } from '../../context/LeafletProvider';
import { MarkerIcon } from './Utils';

const MarkerClusterGroup = ({
  children,
  fnIcon,
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
          typeof fnIcon === 'function'
            ? (cluster) => {
                return L.divIcon(fnIcon(cluster));
              }
            : null
      }).addTo(mapRef.current);

      clusterGroupRef.current = clusterGroup;

      if (clusterGroup.getLayers().length) {
        clusterGroup.clearLayers();
      }

      clusterGroupRef.current = clusterGroup;

      // Add click handler
      if (typeof onMarkerClick === 'function') {
        clusterGroup.on('click', (e) => onMarkerClick(e));
      }

      if (typeof onClick === 'function') {
        clusterGroup.on('clusterclick', (e) => onClick(e));
      }
    }
  }, [fnIcon, props, onMarkerClick, onClick, mapRef, preload]);

  // Add markers as children
  useEffect(() => {
    if (clusterGroupRef.current) {
      const markers = React.Children.map(children, (child) => {
        if (child && child.props.latlng) {
          const { latlng, ...childProps } = child.props;
          const m = L.marker(latlng, {
            icon: MarkerIcon(),
            ...childProps
          });
          if (childProps?.label) {
            m.bindPopup(childProps?.label);
          }
          return m;
        }
        return null;
      });

      // Add valid markers to the cluster group
      if (markers) {
        clusterGroupRef.current.clearLayers();
        clusterGroupRef.current.addLayers(markers.filter(Boolean));
      }
    }
  }, [children]);

  return null; // This component does not render any DOM directly
};

export default MarkerClusterGroup;
