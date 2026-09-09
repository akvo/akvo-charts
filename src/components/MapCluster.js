import React, { forwardRef } from 'react';
import MarkerClusterGroup from './Map/MarkerClusterGroup';
import Marker from './Map/Marker';
import Container from './Map/Container';
import {
  buildQuantityIcon,
  calculateRadiusScale,
  formatCompact,
  sumClusterValue
} from '../utils/mapHelper';

const CLUSTER_TYPE = {
  default: 0,
  circle: 1,
  quantity: 2
};

const DEFAULT_MARKER_ICON = {
  className: 'custom-marker',
  iconSize: [32, 32],
  html: true
};

const clusterCircleIcon = (
  cluster,
  data = [],
  groupKey = 'name',
  props = {}
) => {
  const groupValues = Object.values(
    data?.reduce((acc, item) => {
      const groupName = item?.[groupKey];
      const color = item?.color;
      if (!acc[groupName]) {
        acc[groupName] = { value: groupName, color, count: 0 };
      }
      acc[groupName].count++;

      return acc;
    }, {})
  );
  const totalValue = groupValues.reduce((s, { count }) => s + count, 0);
  const radius = 40;
  const circleLength = Math.PI * (radius * 2);
  let spaceLeft = circleLength;
  return {
    html: `<svg width="100%" height="100%" viewBox="0 0 100 100"> <circle cx="50" cy="50" r="40" fill="#ffffffad"/>
          ${groupValues
            .map((item, index) => {
              const v = index === 0 ? circleLength : spaceLeft;
              spaceLeft -= (item.count / totalValue) * circleLength;
              return `
                <circle cx="50" cy="50" r="40" fill="transparent" stroke-width="15" stroke="${
                  item.color ? item.color : 'red'
                }" stroke-dasharray="${v} ${circleLength}" />`;
            })
            .join(
              ''
            )} <text x="50%" y="50%" fill="black" text-anchor="middle" dy=".3em" font-size="18px">${cluster.getChildCount()}</text></svg>`,
    ...props
  };
};

/**
 * Cluster path: MarkerClusterGroup expects iconSize as a NUMBER.
 */
const quantityClusterIcon = (cluster, { className, ...opts }) => {
  const { html, diameter } = buildQuantityIcon(sumClusterValue(cluster), opts);
  return { html, className, iconSize: diameter };
};

/**
 * Leaf path: L.divIcon expects iconSize as an ARRAY.
 */
const quantityMarkerIcon = (value, { className, ...opts }) => {
  const { html, diameter } = buildQuantityIcon(value, opts);
  return { html, className, iconSize: [diameter, diameter] };
};

const MapCluster = (
  {
    data,
    markerIcon = null,
    clusterIcon = {
      className: `custom-marker-cluster`,
      iconSize: 60
    },
    groupKey = 'name',
    type = 'default',
    valueKey = 'value',
    radius = [16, 56],
    color = '#4c78a8',
    formatValue = formatCompact,
    renderPopup = null,
    ...config
  },
  ref
) => {
  const isQuantity = CLUSTER_TYPE?.[type] === CLUSTER_TYPE.quantity;

  const points = data?.filter((d) => d?.point) || [];
  const radiusScale = calculateRadiusScale(
    points.map((d) => Number(d?.[valueKey]) || 0),
    radius
  );
  const quantityOpts = { color, formatValue, radiusScale };

  const clusterTypes = {
    [CLUSTER_TYPE.default]: null,
    [CLUSTER_TYPE.circle]: (cluster) =>
      clusterCircleIcon(cluster, data, groupKey, clusterIcon),
    [CLUSTER_TYPE.quantity]: (cluster) =>
      quantityClusterIcon(cluster, {
        ...quantityOpts,
        className: clusterIcon?.className
      })
  };

  const iconCreateFn =
    clusterTypes?.[CLUSTER_TYPE?.[type]] || clusterTypes.default;

  /**
   * When `markerIcon` is not supplied and the type is quantity, a leaf marker
   * renders as the same circle sized by its own value - so the map reads as
   * one continuous size scale. An explicit `markerIcon` still wins.
   */
  const buildMarkerIcon = (d) => {
    if (!markerIcon && isQuantity) {
      return quantityMarkerIcon(Number(d?.[valueKey]) || 0, {
        ...quantityOpts,
        className: 'custom-marker-quantity'
      });
    }
    const icon = markerIcon || DEFAULT_MARKER_ICON;
    return {
      ...icon,
      html: icon?.html
        ? `<span style="background-color:${d?.color}; border:2px solid #fff;"/>`
        : null
    };
  };

  return (
    <Container
      ref={ref}
      {...config}
    >
      <MarkerClusterGroup iconCreateFn={iconCreateFn}>
        {points.map((d, dx) => (
          <Marker
            latlng={d?.point}
            key={dx}
            quantityValue={Number(d?.[valueKey]) || 0}
            icon={buildMarkerIcon(d)}
          >
            {typeof renderPopup === 'function' ? (
              renderPopup(d)
            ) : (
              <React.Fragment>{d?.label}</React.Fragment>
            )}
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Container>
  );
};

export default forwardRef(MapCluster);
