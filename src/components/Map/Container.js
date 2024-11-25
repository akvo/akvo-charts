import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import 'leaflet/dist/leaflet.css';
import TileLayer from './TileLayer';
import { LeafletProvider } from '../../context/LeafletProvider';

const Container = ({ children, tile, config }, ref) => {
  const [preload, setPreload] = useState(true);

  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance?.current && preload) {
      setPreload(false);

      if (config?.zoom) {
        mapInstance.current.getMap().setZoom(config.zoom);
      }

      if (config?.center) {
        mapInstance.current.getMap().panTo(config.center);
      }
    }
  }, [config.center, config.zoom, mapInstance, preload]);

  useImperativeHandle(ref, () => mapInstance.current);

  return (
    <LeafletProvider
      ref={mapInstance}
      width={config?.width}
      height={config?.height}
    >
      <TileLayer {...tile} />
      {children}
    </LeafletProvider>
  );
};

export default forwardRef(Container);
