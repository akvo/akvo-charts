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

// const getGeoData = async (url) => {
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// };

const MapView = forwardRef(({ tile, layer, config, data = [] }, ref) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      // Initialize the map only if it hasn't been initialized yet
      const map = L.map(mapContainerRef.current, {
        center: config?.center || [0, 0],
        zoom: config?.zoom || 2
      });

      // Save the map instance to ref
      mapInstanceRef.current = map;

      // Add a tile layer to the map
      if (tile?.url) {
        const { url: tileURL, ...tileProps } = tile;
        L.tileLayer(tileURL, { ...tileProps }).addTo(map);
      }

      // Add a marker to the map
      data
        ?.filter((d) => d?.point && d?.label)
        ?.forEach((d) =>
          L.marker(d?.point, { icon: defaultIcon })
            .bindPopup(d?.label)
            .addTo(map)
        );
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
        style: () =>
          layer?.style || {
            color: '#000',
            opacity: 1,
            weight: 1
          },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties.name);
        }
      }).addTo(map);

      if (layer?.source?.includes('window')) {
        const topoData = getObjectFromString(layer.source);
        if (topoData) {
          geojsonLayer.addData(topoData);
        }
      }
      // if (layer?.url) {
      //   getGeoData(layer.url).then((r) => geojsonLayer.addData(r));
      // }
    }

    // Cleanup function to remove map instance on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    config?.center,
    config?.zoom,
    data,
    layer.source,
    layer?.style,
    layer.url,
    tile
  ]);

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
