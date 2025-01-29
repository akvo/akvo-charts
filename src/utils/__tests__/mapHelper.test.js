import { createRef } from 'react';
import { calculateRanges, getColor, getGeoJSONProps } from '../mapHelper';

describe('utils/mapHelper', () => {
  it('should generate range values based on data and number ranges', () => {
    const data = [5, 7, 15, 20, 35, 50];
    const numRanges = 3;
    const res = [
      [5, 10],
      [10, 23],
      [23, 50]
    ];

    expect(calculateRanges(data, numRanges)).toEqual(res);
  });

  it('should get color correctly based on range values, certain value and colors', () => {
    const ranges = [
      [5, 20],
      [20, 35],
      [35, 50]
    ];
    const colors = ['#FFEDA0', '#FED976', '#FEB24C'];
    const value = 28;

    expect(getColor(ranges, value, colors)).toEqual('#FED976');
  });

  it('should return GeoJSON properties correctly', () => {
    const mapRef = createRef();
    const layer = {
      onClick: null,
      onMouseOver: null,
      mapKey: 'island',
      choropleth: 'island',
      color: ['#FFEDA0', '#FED976', '#FFEDA0'],
      style: {
        color: '#92400e',
        weight: 1
      }
    };
    const data = [
      { island: 'Java', population: 2121 },
      { island: 'Sumatra', population: 1110 },
      { island: 'Borneo', population: 910 },
      { island: 'Sulawesi', population: 810 },
      { island: 'Bali', population: 799 }
    ];

    const props = getGeoJSONProps(mapRef, layer, data);
    expect(Object.keys(props)).toEqual(['style', 'mapKey', 'choropleth']);
    expect(props?.style()).toEqual({
      color: '#92400e',
      weight: 1,
      fillColor: '#FFEDA0'
    });
  });
});
