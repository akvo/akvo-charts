import React, {
  createContext,
  Fragment,
  useContext,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import L from 'leaflet';

const LeafletContext = createContext(null);

export const LeafletProvider = forwardRef(
  ({ children, width, height }, ref) => {
    const mapRef = useRef(null);
    const mapContainer = useRef(null);

    useEffect(() => {
      if (!mapRef.current) {
        const map = L.map(mapContainer.current, { center: [0, 0], zoom: 2 });
        mapRef.current = map;
      }

      // Cleanup function to remove the map instance
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null; // Reset the map ref
        }
      };
    }, []);

    // Expose the Leaflet map instance via ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current
    }));

    return (
      <Fragment>
        <div
          ref={mapContainer}
          style={{
            height: height || '100vh',
            width: width || '100%'
          }}
          data-testid="map-view"
        />
        <LeafletContext.Provider value={mapRef}>
          {children}
        </LeafletContext.Provider>
      </Fragment>
    );
  }
);

export const useLeaflet = () => {
  return useContext(LeafletContext);
};
