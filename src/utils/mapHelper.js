export const calculateRanges = (data = [], numRanges = 1) => {
  const sortedData = data.slice().sort((a, b) => a - b);
  const ranges = [];

  for (let i = 0; i < numRanges; i++) {
    const rangeStart =
      sortedData[Math.floor((i * sortedData.length) / numRanges)];
    const rangeEnd =
      sortedData[Math.floor(((i + 1) * sortedData.length) / numRanges) - 1];
    ranges.push([rangeStart, rangeEnd]);
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
