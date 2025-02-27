import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo
} from 'react';
import L from 'leaflet';
import * as topojson from 'topojson-client';
import 'leaflet/dist/leaflet.css';
import { LeafletProvider } from '../context/LeafletProvider';
import { TileLayer, Marker, GeoJson, LegendControl } from './Map';
import { string2WindowObj } from '../utils/string';
import { getGeoJSONProps } from '../utils/mapHelper';

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
  const [markerLayer, setMarkerLayer] = useState(null);

  const mapInstance = useRef(null);

  const { url: layerURL, source: layerSource, ...layerProps } = layer;

  const geoProps = useMemo(() => {
    return getGeoJSONProps(mapInstance, layerProps, data);
  }, [layerProps, data]);

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

      if (config?.zoom) {
        mapInstance.current.getMap().setZoom(config.zoom);
      }

      if (config?.center) {
        mapInstance.current.getMap().panTo(config.center);
      }
      const lg = L.layerGroup().addTo(mapInstance.current.getMap());
      setMarkerLayer(lg);
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
    if (
      markerLayer &&
      data?.filter((d) => d?.point)?.length === 0 &&
      markerLayer.getLayers().length
    ) {
      markerLayer.clearLayers();
    }
  }, [
    mapInstance,
    preload,
    sourceData,
    layerSource,
    markerLayer,
    config?.zoom,
    config?.center,
    data
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
      {data
        ?.filter((d) => d?.point)
        ?.map((d, dx) => (
          <Marker
            latlng={d?.point}
            label={d?.label}
            markerLayer={markerLayer}
            key={dx}
          />
        ))}
      {getGeoJSONList(geoData).map((gd, gx) => (
        <GeoJson
          key={gx}
          data={gd}
          mapData={data}
          {...geoProps}
        />
      ))}
      {getGeoJSONList(sourceData).map((sd, sx) => (
        <GeoJson
          key={sx}
          data={sd}
          mapData={data}
          {...geoProps}
        />
      ))}
      <LegendControl
        data={data?.map((d) => d?.[layer?.choropleth])?.filter((d) => d)}
        color={layer?.color}
      />
    </LeafletProvider>
  );
};

export default forwardRef(MapView);
