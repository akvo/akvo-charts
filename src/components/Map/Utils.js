import L from 'leaflet';
import mIcon from 'leaflet/dist/images/marker-icon.png';
import mShadow from 'leaflet/dist/images/marker-shadow.png';
import * as topojson from 'topojson-client';
import { renderReactToDiv } from '../../utils/mapHelper';

export const MarkerIcon = (props = {}) => {
  const defaultIcon = typeof mIcon === 'object' ? mIcon?.src : mIcon;
  const defaultShadow = typeof mShadow === 'object' ? mShadow?.src : mShadow;

  const Icon = props?.html
    ? L.divIcon(props)
    : L.icon({
        iconUrl: defaultIcon,
        shadowUrl: defaultShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        ...props
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

export const fnMarker = (
  latlng,
  { children = null, label = null, popUp = {}, icon = {}, ...props }
) => {
  const m = L.marker(latlng, {
    icon: MarkerIcon(icon),
    ...props
  });
  if (label) {
    m.bindPopup(label, popUp || {});
  }
  if (children) {
    const content = renderReactToDiv(children);
    m.bindPopup(content, popUp || {});
  }
  return m;
};
