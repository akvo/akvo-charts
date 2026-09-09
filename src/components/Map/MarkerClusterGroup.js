import React, { useEffect, useRef } from 'react';
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
  const mapRef = useLeaflet();
  const clusterGroupRef = useRef(null);

  // Creates (and, on cleanup, tears down) the Leaflet cluster group.
  //
  // This intentionally does NOT depend on `iconCreateFn`'s identity: callers
  // such as `MapCluster` build that function as a fresh inline arrow on
  // every render, so depending on it directly would recreate the group (and
  // briefly leave the map without one) on every render. Instead, a caller
  // that needs a different `iconCreateFunction` closure - e.g. switching
  // cluster `type` - is expected to remount this component (via a `key`
  // prop), which naturally reruns this effect once for the new instance.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return undefined;
    }

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
    }).addTo(map);

    clusterGroupRef.current = clusterGroup;

    // Add click handler
    if (typeof onMarkerClick === 'function') {
      clusterGroup.on('click', (e) => onMarkerClick(e));
    }

    if (typeof onClick === 'function') {
      clusterGroup.on('clusterclick', (e) => onClick(e));
    }

    return () => {
      map.removeLayer(clusterGroup);
      if (clusterGroupRef.current === clusterGroup) {
        clusterGroupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

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
