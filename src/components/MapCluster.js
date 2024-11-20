import React, { forwardRef } from 'react';
import MarkerClusterGroup from './Map/MarkerClusterGroup';
import Marker from './Map/Marker';
import { default as Container } from './Map/View';

const CLUSTER_TYPE = {
  default: 0,
  circle: 1
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

const MapCluster = (
  {
    data,
    markerIcon = {
      className: 'custom-marker',
      iconSize: [32, 32],
      html: true
    },
    clusterIcon = {
      className: `custom-marker-cluster`,
      iconSize: 60
    },
    groupKey = 'name',
    type = 'default',
    renderPopup = null,
    ...config
  },
  ref
) => {
  const clusterTypes = {
    [CLUSTER_TYPE.default]: null,
    [CLUSTER_TYPE.circle]: (cluster) =>
      clusterCircleIcon(cluster, data, groupKey, clusterIcon)
  };

  const iconCreateFn =
    clusterTypes?.[CLUSTER_TYPE?.[type]] || clusterTypes.default;

  return (
    <Container
      ref={ref}
      {...config}
    >
      <MarkerClusterGroup iconCreateFn={iconCreateFn}>
        {data
          ?.filter((d) => d?.point)
          ?.map((d, dx) => (
            <Marker
              latlng={d?.point}
              key={dx}
              icon={{
                ...markerIcon,
                html: markerIcon?.html
                  ? `<span style="background-color:${d?.color}; border:2px solid #fff;"/>`
                  : null
              }}
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
