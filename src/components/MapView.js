import React, {
  Fragment,
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

  const mapContainerRef = useRef(null);
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
          onClick: (props) => layerOnClick(mapInstance.current.getMap(), props)
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
  }, [mapInstance, preload, sourceData, layerSource]);

  // Expose the Leaflet map instance via ref
  useImperativeHandle(ref, () => mapInstance.current);

  return (
    <Fragment>
      <div
        ref={mapContainerRef}
        style={{
          height: config?.height || '100vh',
          width: config?.width || '100%'
        }}
        data-testid="map-view"
      />
      <LeafletProvider
        ref={mapInstance}
        mapContainerRef={mapContainerRef}
        center={config?.center}
        zoom={config?.zoom}
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
    </Fragment>
  );
};

export default forwardRef(MapView);
