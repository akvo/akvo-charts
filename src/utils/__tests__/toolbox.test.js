import { resolveToolbox, toCsv } from '../toolbox';

describe('utils/toolbox', () => {
  describe('resolveToolbox', () => {
    const bar = { toolbox: true, chartType: 'bar', showAxis: true };

    it('should return null when no toolbox is requested', () => {
      expect(resolveToolbox()).toBeNull();
      expect(resolveToolbox({ ...bar, toolbox: undefined })).toBeNull();
      expect(resolveToolbox({ ...bar, toolbox: false })).toBeNull();
    });

    it('should enable image, csv, zoom, switch and restore for a bar chart', () => {
      const { feature } = resolveToolbox(bar);

      expect(Object.keys(feature).sort()).toEqual([
        'dataZoom',
        'magicType',
        'myCsv',
        'restore',
        'saveAsImage'
      ]);
    });

    it('should offer the sibling chart type to magicType', () => {
      expect(resolveToolbox(bar).feature.magicType.type).toEqual([
        'bar',
        'line'
      ]);
      expect(
        resolveToolbox({ ...bar, chartType: 'line' }).feature.magicType.type
      ).toEqual(['line', 'bar']);
    });

    it('should drop zoom, switch and restore when the chart has no axes', () => {
      const { feature } = resolveToolbox({
        toolbox: true,
        chartType: 'pie',
        showAxis: false
      });

      expect(Object.keys(feature).sort()).toEqual(['myCsv', 'saveAsImage']);
    });

    it('should drop only switch for scatter, which is not a magicType target', () => {
      const { feature } = resolveToolbox({
        toolbox: true,
        chartType: 'scatter',
        showAxis: true
      });

      expect(feature.magicType).toBeUndefined();
      expect(feature.dataZoom).toBeDefined();
      expect(feature.restore).toBeDefined();
    });

    it('should never include dataView unless it is named explicitly', () => {
      expect(resolveToolbox(bar).feature.dataView).toBeUndefined();
      expect(
        resolveToolbox({ ...bar, toolbox: ['dataView'] }).feature.dataView
      ).toBeDefined();
    });

    it('should honour an explicit list, including a restore with nothing to restore', () => {
      const { feature } = resolveToolbox({
        ...bar,
        toolbox: ['image', 'restore']
      });

      expect(Object.keys(feature).sort()).toEqual(['restore', 'saveAsImage']);
    });

    it('should keep an explicitly named restore even on an axis-less chart', () => {
      const { feature } = resolveToolbox({
        toolbox: ['image', 'restore'],
        chartType: 'pie',
        showAxis: false
      });

      expect(feature.restore).toBeDefined();
    });

    it('should ignore unknown tool names', () => {
      expect(
        resolveToolbox({ ...bar, toolbox: ['image', 'teleport'] }).feature
          .saveAsImage
      ).toBeDefined();
      expect(resolveToolbox({ ...bar, toolbox: ['teleport'] })).toBeNull();
    });

    it('should return null when every requested tool is illegal for the chart', () => {
      expect(
        resolveToolbox({
          toolbox: ['zoom', 'switch'],
          chartType: 'pie',
          showAxis: false
        })
      ).toBeNull();
    });

    it('should export on a white background, not the transparent chart background', () => {
      expect(resolveToolbox(bar).feature.saveAsImage.backgroundColor).toEqual(
        '#fff'
      );
    });

    it('should name exports after the chart title, falling back to "chart"', () => {
      expect(
        resolveToolbox({ ...bar, title: 'Sales by Region 2026!' }).feature
          .saveAsImage.name
      ).toEqual('sales-by-region-2026');
      expect(resolveToolbox(bar).feature.saveAsImage.name).toEqual('chart');
    });

    it('should resolve tools identically whichever shape they arrive in', () => {
      const flat = resolveToolbox({ ...bar, toolbox: ['image', 'csv'] });
      const wrapped = resolveToolbox({
        ...bar,
        toolbox: { tools: ['image', 'csv'] }
      });

      expect(Object.keys(wrapped.feature)).toEqual(Object.keys(flat.feature));
    });
  });

  describe('resolveToolbox position', () => {
    const at = (position) =>
      resolveToolbox({ toolbox: { tools: true, position }, chartType: 'bar' });

    it('should default to the top right, horizontally', () => {
      const box = resolveToolbox({ toolbox: true, chartType: 'bar' });

      expect(box.right).toEqual(10);
      expect(box.top).toEqual(0);
      expect(box.left).toBeUndefined();
      expect(box.orient).toBeUndefined();
    });

    it('should map each named corner', () => {
      expect(at('lefttop')).toMatchObject({ left: 10, top: 0 });
      expect(at('righttop')).toMatchObject({ right: 10, top: 0 });
      expect(at('leftbottom')).toMatchObject({ left: 10, bottom: 10 });
      expect(at('rightbottom')).toMatchObject({ right: 10, bottom: 10 });
      expect(at('center')).toMatchObject({ left: 'center', top: 0 });
    });

    it('should stand the toolbar up for the vertically centered names', () => {
      expect(at('left')).toMatchObject({
        left: 10,
        top: 'middle',
        orient: 'vertical'
      });
      expect(at('right')).toMatchObject({
        right: 10,
        top: 'middle',
        orient: 'vertical'
      });
    });

    it('should never set both a left and a right', () => {
      [
        'left',
        'right',
        'lefttop',
        'righttop',
        'leftbottom',
        'rightbottom',
        'center'
      ].forEach((position) => {
        const box = at(position);
        expect(box.left === undefined || box.right === undefined).toBe(true);
      });
    });

    it('should lowercase the name before looking it up', () => {
      expect(at('rightBottom')).toMatchObject({ right: 10, bottom: 10 });
    });

    it('should fall back to the default for an unknown name rather than throwing', () => {
      expect(at('somewhere-else')).toMatchObject({ right: 10, top: 0 });
    });

    it('should pass an object through verbatim', () => {
      expect(at({ left: '20%', bottom: 4, orient: 'vertical' })).toMatchObject({
        left: '20%',
        bottom: 4,
        orient: 'vertical'
      });
    });
  });

  describe('toCsv', () => {
    it('should write a header row and object rows in dimension order', () => {
      const source = [
        { sales: 30, product: 'P1' },
        { sales: 20, product: 'P2' }
      ];

      expect(toCsv(['product', 'sales'], source)).toEqual(
        'product,sales\r\nP1,30\r\nP2,20'
      );
    });

    it('should write array rows with no header when there are no dimensions', () => {
      expect(
        toCsv(
          [],
          [
            [1, 2, 'a'],
            [3, 4, 'b']
          ]
        )
      ).toEqual('1,2,a\r\n3,4,b');
    });

    it('should quote fields containing a comma, a quote or a newline', () => {
      expect(toCsv(['a'], [{ a: 'x,y' }])).toEqual('a\r\n"x,y"');
      expect(toCsv(['a'], [{ a: 'say "hi"' }])).toEqual('a\r\n"say ""hi"""');
      expect(toCsv(['a'], [{ a: 'line1\nline2' }])).toEqual(
        'a\r\n"line1\nline2"'
      );
    });

    it('should render null and undefined as empty cells, not as text', () => {
      expect(toCsv(['a', 'b'], [{ a: null, b: undefined }])).toEqual(
        'a,b\r\n,'
      );
    });

    it('should handle empty datasets', () => {
      expect(toCsv([], [])).toEqual('');
      expect(toCsv(['a'], [])).toEqual('a');
      expect(toCsv()).toEqual('');
    });
  });
});
