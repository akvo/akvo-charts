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
