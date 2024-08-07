import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import L from 'leaflet';

const LeafletContext = createContext(null);

export const LeafletProvider = forwardRef(
  ({ mapContainerRef, children, center, zoom }, ref) => {
    const mapRef = useRef(null);

    useEffect(() => {
      if (mapContainerRef?.current) {
        const map = L.map(mapContainerRef.current, {
          center: center || [0, 0],
          zoom: zoom || 2
        });
        mapRef.current = map;
      }

      // Cleanup function to remove the map instance
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, [mapContainerRef, center, zoom]);

    // Expose the Leaflet map instance via ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current
    }));

    return (
      <LeafletContext.Provider value={mapRef}>
        {children}
      </LeafletContext.Provider>
    );
  }
);

export const useLeaflet = () => {
  return useContext(LeafletContext);
};
