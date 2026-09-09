import { createRef } from 'react';
import {
  calculateRanges,
  getColor,
  getGeoJSONProps,
  formatCompact,
  calculateRadiusScale,
  sumClusterValue,
  buildQuantityIcon
} from '../mapHelper';

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

  describe('formatCompact', () => {
    it('should leave values below one thousand unchanged', () => {
      expect(formatCompact(0)).toEqual('0');
      expect(formatCompact(999)).toEqual('999');
    });

    it('should abbreviate thousands, millions and billions', () => {
      expect(formatCompact(1000)).toEqual('1K');
      expect(formatCompact(1200)).toEqual('1.2K');
      expect(formatCompact(890000)).toEqual('890K');
      expect(formatCompact(10562088)).toEqual('10.6M');
      expect(formatCompact(2500000000)).toEqual('2.5B');
    });

    it('should coerce non-numeric input to zero', () => {
      expect(formatCompact(undefined)).toEqual('0');
      expect(formatCompact('abc')).toEqual('0');
    });
  });

  describe('calculateRadiusScale', () => {
    it('should map the smallest value to rMin and the total to rMax', () => {
      const scale = calculateRadiusScale([100, 300], [16, 56]);

      expect(scale(100)).toEqual(16);
      expect(scale(400)).toEqual(56);
    });

    it('should scale the radius above rMin by the square root of the normalized value', () => {
      // domain is [100, 400], span 300. Value 175 sits at ratio 0.25,
      // so sqrt(0.25) = 0.5 of the 40px range above the 16px floor.
      const scale = calculateRadiusScale([100, 300], [16, 56]);

      expect(scale(175)).toEqual(36);
    });

    it('should clamp values outside the domain', () => {
      const scale = calculateRadiusScale([100, 300], [16, 56]);

      expect(scale(0)).toEqual(16);
      expect(scale(99999)).toEqual(56);
    });

    it('should return rMin for empty data, a single row and all-equal values', () => {
      expect(calculateRadiusScale([], [16, 56])(100)).toEqual(16);
      expect(calculateRadiusScale([500], [16, 56])(500)).toEqual(16);
      expect(calculateRadiusScale([0, 0], [16, 56])(0)).toEqual(16);
    });

    it('should coerce non-numeric values to zero', () => {
      const scale = calculateRadiusScale([null, 300], [16, 56]);

      expect(scale(undefined)).toEqual(16);
    });
  });

  describe('sumClusterValue', () => {
    it('should sum the quantityValue option across all child markers', () => {
      const cluster = {
        getAllChildMarkers: () => [
          { options: { quantityValue: 120 } },
          { options: { quantityValue: 380 } }
        ]
      };

      expect(sumClusterValue(cluster)).toEqual(500);
    });

    it('should treat missing or non-numeric values as zero', () => {
      const cluster = {
        getAllChildMarkers: () => [
          { options: { quantityValue: 120 } },
          { options: {} },
          { options: { quantityValue: 'abc' } }
        ]
      };

      expect(sumClusterValue(cluster)).toEqual(120);
    });

    it('should return zero when the cluster exposes no children', () => {
      expect(sumClusterValue(null)).toEqual(0);
      expect(sumClusterValue({ getAllChildMarkers: () => [] })).toEqual(0);
    });
  });

  describe('buildQuantityIcon', () => {
    const opts = {
      color: '#4c78a8',
      formatValue: formatCompact,
      radiusScale: calculateRadiusScale([100, 300], [16, 56])
    };

    it('should return a diameter of twice the scaled radius', () => {
      expect(buildQuantityIcon(175, opts).diameter).toEqual(72);
    });

    it('should render the formatted value and the fill color into the svg', () => {
      const { html } = buildQuantityIcon(400, opts);

      expect(html).toContain('400');
      expect(html).toContain('#4c78a8');
      expect(html).toContain('<svg');
    });

    it('should accept a function for color', () => {
      const { html } = buildQuantityIcon(400, {
        ...opts,
        color: (v) => (v > 300 ? '#ff0000' : '#00ff00')
      });

      expect(html).toContain('#ff0000');
    });

    it('should keep the RENDERED label size at or above a 10px floor on a small circle', () => {
      // radiusScale pinned to the leaf minimum: radius 16 -> diameter 32.
      const { html, diameter } = buildQuantityIcon(1, {
        radiusScale: () => 16
      });
      expect(diameter).toEqual(32);

      const match = html.match(/font-size="([\d.]+)px"/);
      expect(match).not.toBeNull();

      const fontVb = parseFloat(match[1]);
      const renderedPx = fontVb * (diameter / 100);

      expect(renderedPx).toBeGreaterThanOrEqual(10);
    });

    it('should let the label grow proportionally (no ceiling) on a large circle', () => {
      const { html, diameter } = buildQuantityIcon(1, {
        radiusScale: () => 56 // rMax default -> diameter 112
      });

      const match = html.match(/font-size="([\d.]+)px"/);
      const fontVb = parseFloat(match[1]);
      const renderedPx = fontVb * (diameter / 100);

      expect(renderedPx).toBeCloseTo(diameter * 0.22, 5);
    });

    it('should render the circle without a white outline stroke, filling the icon box', () => {
      const { html } = buildQuantityIcon(400, opts);

      expect(html).toContain('r="50"');
      expect(html).not.toContain('stroke=');
      expect(html).not.toContain('stroke-width');
    });

    it('should render the label in bold', () => {
      const { html } = buildQuantityIcon(400, opts);

      expect(html).toContain('font-weight="bold"');
    });

    it('should mark the svg as overflow-visible so small-circle labels are not clipped', () => {
      const { html } = buildQuantityIcon(1, { radiusScale: () => 16 });

      expect(html).toContain('overflow="visible"');
    });
  });
});
