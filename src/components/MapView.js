import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import * as topojson from 'topojson-client';
import 'leaflet/dist/leaflet.css';
import { LeafletProvider } from '../context/LeafletProvider';
import { TileLayer, Marker, GeoJson } from './Map';
import { string2WindowObj } from '../utils/string';

const getGeoJSONList = (d) => {
  if (!d) {
    return [];
  }
  if (d?.type === 'Topology') {
    /**
     * Convert TopoJSON to GeoJSON
     */
    return Object.keys(d.objects).map((kd) =>
      topojson.feature(d, d.objects[kd])
    );
  }
  return [d];
};

const MapView = ({ tile, layer, config, data }, ref) => {
  const [geoData, setGeoData] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [preload, setPreload] = useState(true);

  const mapInstance = useRef(null);

  const {
    url: layerURL,
    source: layerSource,
    onClick: layerOnClick,
    ...layerProps
  } = layer;

  const geoProps =
    typeof layerOnClick === 'function'
      ? {
          ...layerProps,
          onClick: (props) => {
            try {
              layerOnClick(mapInstance.current.getMap(), props);
            } catch (err) {
              console.error('GeoJson|onClick', err);
            }
          }
        }
      : layerProps;

  const loadGeoDataFromURL = useCallback(async () => {
    if (layerURL && !geoData) {
      try {
        const res = await fetch(layerURL);
        const apiData = await res.json();
        if (apiData) {
          setGeoData(apiData);
        }
      } catch (err) {
        console.error('loadGeoDataFromURL', err);
      }
    }
  }, [layerURL, geoData]);

  useEffect(() => {
    loadGeoDataFromURL();
  }, [loadGeoDataFromURL]);

  useEffect(() => {
    if (mapInstance?.current && preload) {
      if (config?.zoom) {
        mapInstance.current.getMap().setZoom(config.zoom);
      }

      if (config?.center) {
        mapInstance.current.getMap().panTo(config.center);
      }

      setPreload(false);
    }
    if (!sourceData) {
      if (typeof layerSource === 'string' && layerSource?.includes('window')) {
        const windowObj = string2WindowObj(layerSource);
        if (windowObj) {
          setSourceData(windowObj);
        }
      }

      if (typeof layerSource === 'object') {
        setSourceData(layerSource);
      }
    }
  }, [
    mapInstance,
    preload,
    sourceData,
    layerSource,
    config?.zoom,
    config?.center
  ]);

  // Expose the Leaflet map instance via ref
  useImperativeHandle(ref, () => mapInstance.current);

  return (
    <LeafletProvider
      ref={mapInstance}
      width={config?.width}
      height={config?.height}
    >
      <TileLayer {...tile} />
      {data?.map((d, dx) => (
        <Marker
          latlng={d?.point}
          label={d?.label}
          key={dx}
        />
      ))}
      {getGeoJSONList(geoData).map((gd, gx) => (
        <GeoJson
          key={gx}
          data={gd}
          {...geoProps}
        />
      ))}
      {getGeoJSONList(sourceData).map((sd, sx) => (
        <GeoJson
          key={sx}
          data={sd}
          {...geoProps}
        />
      ))}
    </LeafletProvider>
  );
};

export default forwardRef(MapView);
