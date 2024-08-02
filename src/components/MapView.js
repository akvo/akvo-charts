// src/MapView.js
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import L from 'leaflet';
import * as topojson from 'topojson-client';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the default icon for markers
const defaultIcon = L.icon({
  iconUrl: typeof markerIcon === 'object' ? markerIcon?.src : markerIcon,
  shadowUrl:
    typeof markerShadow === 'object' ? markerShadow?.src : markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getObjectFromString = (path) =>
  path.split('.').reduce((obj, key) => obj && obj[key], window);

const MapView = forwardRef(({ data = [], config = {}, layers = [] }, ref) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      const baseMaps = layers
        ?.filter((l) => l?.url || l?.source)
        ?.map((ly, lx) => {
          const { url: tileURL, source, name: tn, ...lyProps } = ly;

          const tileName = tn || lx + 1;

          if (source) {
            if (!getObjectFromString(source)) {
              return null;
            }
            const { url: windowURL, ...wProps } = getObjectFromString(source);
            return {
              name: tileName,
              tile: L.tileLayer(windowURL, { ...wProps })
            };
          }
          return {
            name: tileName,
            tile: L.tileLayer(tileURL, { ...lyProps })
          };
        })
        ?.filter((ly) => ly?.name)
        ?.reduce((curr, prev) => {
          curr[prev.name] = prev.tile;
          return curr;
        }, {});

      const groupedMarkers = data
        ?.filter((d) => d?.point && d?.label)
        ?.reduce((curr, prev) => {
          const key = prev?.groupName || 'Data';
          if (!curr[key]) {
            curr[key] = [];
          }
          curr[key].push(
            L.marker(prev.point, { icon: defaultIcon }).bindPopup(prev.label)
          );
          return curr;
        }, {});

      const overlayMaps = Object.keys(groupedMarkers).reduce((acc, key) => {
        acc[key] = L.layerGroup(groupedMarkers[key]);
        return acc;
      }, {});

      const defaultBkey = Object.keys(baseMaps)?.[0];
      const defaultPKey = Object.keys(overlayMaps)?.[0];
      const defaultLayers = baseMaps?.[defaultBkey] || [];
      if (overlayMaps?.[defaultPKey]?.[0]) {
        defaultLayers.push(overlayMaps[defaultPKey][0]);
      }

      // Initialize the map only if it hasn't been initialized yet
      const map = L.map(mapContainerRef.current, {
        center: config?.center || [0, 0],
        zoom: config?.zoom || 2,
        layers: defaultLayers
      });

      // Create the TopoJSON layer
      const TopoJSON = L.GeoJSON.extend({
        addData: (d) => {
          if (d.type === 'Topology') {
            for (let kd in d.objects) {
              if (d.objects.hasOwnProperty(kd)) {
                const geojson = topojson.feature(d, d.objects[kd]);
                L.geoJSON(geojson).addTo(map);
              }
            }
          }
        }
      });

      L.topoJson = function (d, options) {
        return new TopoJSON(d, options);
      };

      // Create an empty GeoJSON layer with a style and a popup on click
      const geojsonLayer = L.topoJson(null, {
        style: () => {
          return {
            color: '#000',
            opacity: 1,
            weight: 1,
            fillColor: '#35495d',
            fillOpacity: 0.8
          };
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties.name);
        }
      }).addTo(map);

      if (window?.topoData) {
        geojsonLayer.addData(window?.topoData);
      }

      // Add layers controls
      L.control.layers(baseMaps, overlayMaps).addTo(map);

      // Save the map instance to ref
      mapInstanceRef.current = map;
    }

    // Cleanup function to remove map instance on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, config, layers]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomIn();
      }
    },
    zoomOut: () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomOut();
      }
    },
    getCenter: () => {
      if (mapInstanceRef.current) {
        return mapInstanceRef.current.getCenter();
      }
      return null;
    }
  }));

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: config?.height || '100vh',
        width: config?.width || '100%'
      }}
      data-testid="map-view"
    />
  );
});

export default MapView;
