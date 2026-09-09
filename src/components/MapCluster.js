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

/**
 * `buildMarkerIcon` only reaches the quantity branch when `markerIcon` is
 * falsy (an explicit `markerIcon` opts a caller out of the quantity circle
 * entirely - see the design doc's "accepted cost"). So `markerIcon?.className`
 * can never contribute a value in that branch, unlike the cluster path's
 * `clusterIcon?.className`. There is currently no supported way to keep the
 * quantity leaf circle AND rename its class, so this stays a named constant
 * rather than a bare inline string, documenting the class name instead of
 * pretending it is configurable.
 */
const QUANTITY_MARKER_CLASSNAME = 'custom-marker-quantity';

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

/**
 * Builds the default popup content for a leaf marker. Exported as a pure
 * function (rather than only inlined in the component) because Leaflet
 * markers don't render in jsdom, so component tests can't assert on popup
 * DOM - but this piece is plain React, testable in isolation.
 *
 * A user-supplied `renderPopup` always wins. Otherwise, quantity maps show
 * the label plus the EXACT value (`toLocaleString`, not the compact form
 * already shown inside the circle); every other type keeps showing only
 * the label, unchanged.
 */
export const buildPopupContent = (
  d,
  { renderPopup, isQuantity, valueKey } = {}
) => {
  if (typeof renderPopup === 'function') {
    return renderPopup(d);
  }
  if (isQuantity) {
    return (
      <React.Fragment>
        {d?.label}
        <br />
        <strong>{(Number(d?.[valueKey]) || 0).toLocaleString()}</strong>
      </React.Fragment>
    );
  }
  return <React.Fragment>{d?.label}</React.Fragment>;
};

/**
 * `cluster` accepts a boolean or a Leaflet.markercluster options object:
 *
 * - `true` (default) - clustering as before, no options overridden.
 * - `false` - clustering off. `disableClusteringAtZoom: 0` pulls the group's
 *   internal max zoom below the map's min zoom, so the slotting loop in
 *   `_addLayer` never runs and every marker attaches to the top level.
 *   `maxClusterRadius: 0` is NOT equivalent: it still groups points that share
 *   exact coordinates, and it funnels every point into a single distance-grid
 *   cell, making inserts quadratic on exactly the large datasets clustering is
 *   meant for.
 * - object - passed straight through to `L.markerClusterGroup`.
 *
 * Options are per-instance (Leaflet's `setOptions` copies the prototype
 * defaults onto the instance before writing), so turning clustering off on one
 * map never affects another map on the page.
 */
const NO_CLUSTERING = { disableClusteringAtZoom: 0 };

const resolveClusterOptions = (cluster) => {
  if (cluster === false) {
    return NO_CLUSTERING;
  }
  if (cluster && typeof cluster === 'object') {
    return cluster;
  }
  return {};
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
    cluster = true,
    ...config
  },
  ref
) => {
  const isQuantity = CLUSTER_TYPE?.[type] === CLUSTER_TYPE.quantity;
  const clusterOptions = resolveClusterOptions(cluster);

  const points = data?.filter((d) => d?.point) || [];
  // `default` and `circle` consumers never use the radius scale, and
  // computing it unconditionally cost every render an O(n) map + reduce +
  // `Math.min(...numbers)` - the latter throws past ~100k points (argument
  // spread has a call-stack limit), exactly the size clustering targets.
  const radiusScale = isQuantity
    ? calculateRadiusScale(
        points.map((d) => Number(d?.[valueKey]) || 0),
        radius
      )
    : null;
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
        className: QUANTITY_MARKER_CLASSNAME
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
      <MarkerClusterGroup
        key={`${type}-${JSON.stringify(clusterOptions)}`}
        iconCreateFn={iconCreateFn}
        {...clusterOptions}
      >
        {points.map((d, dx) => (
          <Marker
            latlng={d?.point}
            key={dx}
            {...(isQuantity
              ? { quantityValue: Number(d?.[valueKey]) || 0 }
              : {})}
            icon={buildMarkerIcon(d)}
          >
            {buildPopupContent(d, { renderPopup, isQuantity, valueKey })}
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Container>
  );
};

export default forwardRef(MapCluster);
