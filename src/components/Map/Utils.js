import L from 'leaflet';
import mIcon from 'leaflet/dist/images/marker-icon.png';
import mShadow from 'leaflet/dist/images/marker-shadow.png';
import * as topojson from 'topojson-client';

export const MarkerIcon = () => {
  const defaultIcon = typeof mIcon === 'object' ? mIcon?.src : mIcon;
  const defaultShadow = typeof mShadow === 'object' ? mShadow?.src : mShadow;

  const Icon = L.icon({
    iconUrl: defaultIcon,
    shadowUrl: defaultShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return Icon;
};

export const getGeoJSONList = (d) => {
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
