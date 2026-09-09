import ReactDOM from 'react-dom';

export const calculateRanges = (data = [], numRanges = 1) => {
  const sortedData = data.slice().sort((a, b) => a - b);
  if (sortedData.length === 0) return [];

  // Calculate the minimum and maximum range from the data
  const minRange = Math.min(...sortedData);
  const maxRange = Math.max(...sortedData);

  // Calculate logarithmic step size
  const logMin = Math.log10(minRange);
  const logMax = Math.log10(maxRange);
  const logStep = (logMax - logMin) / numRanges;

  const ranges = [];

  for (let i = 0; i < numRanges; i++) {
    const rangeStart = Math.pow(10, logMin + i * logStep);
    const rangeEnd =
      i === numRanges - 1 ? maxRange : Math.pow(10, logMin + (i + 1) * logStep);
    ranges.push([Math.floor(rangeStart), Math.floor(rangeEnd)]);
  }

  return ranges;
};

export const getColor = (ranges = [], value = 0, colors = []) => {
  const numColors = colors.length;

  if (numColors === 0) return '#FFFFFF'; // Return a default color if no colors are provided
  const findIndex = ranges.findIndex((r) => {
    const [min, max] = r;
    return value >= min && value <= max;
  });
  return colors?.[findIndex] || colors[0];
};

export const formatCompact = (n) => {
  const value = Number(n) || 0;
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${parseFloat((value / 1e9).toFixed(1))}B`;
  if (abs >= 1e6) return `${parseFloat((value / 1e6).toFixed(1))}M`;
  if (abs >= 1e3) return `${parseFloat((value / 1e3).toFixed(1))}K`;
  return `${value}`;
};

/**
 * Build a value -> radius function.
 *
 * `values` is the list of INDIVIDUAL row values. The domain is derived from
 * them as [min(values), sum(values)] - the sum, not the max, because the
 * largest circle ever drawn is the fully-collapsed cluster holding every
 * point. The domain is fixed for the lifetime of the data so circle sizes
 * stay comparable across zoom levels.
 *
 * Radius uses sqrt, so width grows sub-linearly with value. Note this is NOT
 * strict area-proportionality: the rMin floor and the vMin offset both break
 * it, so a 4x value does not draw a 2x-wide circle.
 */
export const calculateRadiusScale = (values = [], range = [16, 56]) => {
  const [rMin, rMax] = range;
  const numbers = (values || []).map((v) => Number(v) || 0);

  if (!numbers.length) {
    return () => rMin;
  }

  const vMin = Math.min(...numbers);
  const vMax = numbers.reduce((sum, v) => sum + v, 0);
  const span = vMax - vMin;

  return (value) => {
    if (span <= 0) {
      return rMin;
    }
    const v = Number(value) || 0;
    const ratio = Math.min(Math.max((v - vMin) / span, 0), 1);
    return rMin + (rMax - rMin) * Math.sqrt(ratio);
  };
};

export const sumClusterValue = (cluster, optionKey = 'quantityValue') => {
  const markers =
    typeof cluster?.getAllChildMarkers === 'function'
      ? cluster.getAllChildMarkers()
      : [];
  return markers.reduce(
    (sum, m) => sum + (Number(m?.options?.[optionKey]) || 0),
    0
  );
};

// Minimum RENDERED label size, in real px, regardless of circle diameter.
const MIN_LABEL_PX = 10;

export const buildQuantityIcon = (
  value,
  { color = '#4c78a8', formatValue = formatCompact, radiusScale } = {}
) => {
  const radius = typeof radiusScale === 'function' ? radiusScale(value) : 16;
  const diameter = Math.round(radius * 2);
  const fill = typeof color === 'function' ? color(value) : color;

  /**
   * The <svg> has a fixed 0-100 viewBox scaled to fit the icon's pixel box,
   * so every length declared inside it - including font-size - scales with
   * the box. A hard-coded "18px" font-size therefore rendered at ~5.8px on
   * the smallest leaf circles (32px diameter), making the label unreadable
   * right where the feature's whole point - a value-labelled circle - most
   * needs to hold. To give the RENDERED size a floor, pick the desired
   * rendered px size first (with a floor), then convert it back into
   * viewBox units so it renders at that size no matter the diameter.
   */
  const safeDiameter = diameter || 1;
  const fontPx = Math.max(MIN_LABEL_PX, safeDiameter * 0.22);
  const fontVb = (fontPx / safeDiameter) * 100;

  return {
    diameter,
    html: `<svg width="100%" height="100%" viewBox="0 0 100 100" overflow="visible"><circle cx="50" cy="50" r="50" fill="${fill}" fill-opacity="0.85"/><text x="50%" y="50%" fill="#ffffff" text-anchor="middle" dy=".3em" font-size="${fontVb}px" font-weight="bold">${formatValue(
      value
    )}</text></svg>`
  };
};

export const getGeoJSONProps = (
  mapInstance,
  { onClick, onMouseOver, mapKey, choropleth, color, style, ...props },
  data = []
) => {
  let allProps = { ...props, style };
  if (typeof onClick === 'function') {
    allProps = {
      ...allProps,
      onClick: (props) => {
        try {
          onClick(mapInstance.current.getMap(), props);
        } catch (err) {
          console.error('GeoJson|onClick', err);
        }
      }
    };
  }
  if (typeof onMouseOver === 'function') {
    allProps = {
      ...allProps,
      onMouseOver: (props) => {
        try {
          onMouseOver(mapInstance.current.getMap(), props);
        } catch (err) {
          console.error('GeoJson|onMouseOver', err);
        }
      }
    };
  }
  if (mapKey && choropleth) {
    allProps = {
      ...allProps,
      mapKey,
      choropleth,
      style: (feature) => {
        const findData = data?.find(
          (d) => d?.[mapKey] === feature?.properties?.[mapKey]
        );
        const value = findData?.[choropleth] || 0;
        const values = data?.map((d) => d?.[choropleth]);
        const ranges = calculateRanges(values, color?.length);
        return {
          ...style,
          fillColor: getColor(ranges, value, color)
        };
      }
    };
  }
  return allProps;
};

export const renderReactToDiv = (children) => {
  // Create a container div
  const container = document.createElement('div');
  // Render React children into the container
  ReactDOM.render(children, container);
  return container;
};
