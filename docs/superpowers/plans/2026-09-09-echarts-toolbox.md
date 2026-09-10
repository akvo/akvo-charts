# ECharts Toolbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `config.toolbox` so a chart can carry a toolbar — save image, save CSV, zoom, switch chart type, restore, data view — with the library resolving which tools are legal for the chart being drawn.

**Architecture:** All resolution and CSV logic lives in a new `src/utils/toolbox.js`, pure and unit-testable without ECharts or a DOM. `src/hooks/useECharts.js` gains a call to it after `getOptions` has merged, plus a guard that stops rebuilding the chart when the option has not changed. No component file changes, no changes to `transformConfig`, `normalizeData`, or any Map component.

**Tech Stack:** React 16+, ECharts 5, Jest via `react-scripts test` (library), Jest + Next.js (example app).

**Spec:** `docs/superpowers/specs/2026-09-09-echarts-toolbox-design.md`

## Global Constraints

- When `config.toolbox` is absent or `false`, the emitted option must contain **no `toolbox` key at all** — not `{ show: false }`, which still registers the component. Every pre-existing snapshot must come out byte-identical.
- The toolbox is built from `options.dataset` **after** `getOptions` has merged, never from `normalizeData(data)`. `ScatterPlot` replaces `dataset.source` wholesale (`src/components/ScatterPlot.js:56`) and never passes `data` to the hook, so building it earlier hands ScatterPlot an empty CSV.
- The re-render guard applies to the **`config` path only**. The `rawConfig` path keeps today's unconditional `clear()` + `setOption`, because a consumer's formatter closing over their own state is invisible to serialization.
- `dataView` is never in the `toolbox: true` set. It is reachable only by naming it explicitly.
- `config.toolbox` accepts three shapes — `true`, a string array, or `{ tools, position }`. `resolveToolbox` normalizes them once, at the top, so no rule below it sees more than one shape.
- Position names must never emit both a `left` and a `right`. Keep positional properties out of the `Toolbox` base object and take them only from the `ToolboxPosition` table, or a merge will set both and ECharts will honour both.
- `rawConfig` remains the route to custom icons and per-feature ECharts options.
- `saveAsImage` must set `backgroundColor: '#fff'`. The library-wide background is `transparent` (`src/utils/basicChartStyle.js:1`) and ECharts' default `'auto'` would export a transparent PNG.
- CSV is written with a `﻿` BOM and `\r\n` line endings so Excel opens non-ASCII data correctly.
- Library tests run from the repo root; example tests run from `example/`.
- Do not bump the version.
- `dist/` **must be rebuilt and committed** at the end of the work (`yarn build`). The example app resolves `akvo-charts` via `"link:.."` to `dist/index.js`, so it renders built output, not `src/` — skipping the rebuild leaves the playground silently running the old code. Individual tasks should not commit `dist/` churn mid-stream; it is rebuilt once in Task 5.
- **Commit messages must be prefixed `[#53]`** — this repo ties every commit to its
  GitHub issue (see `[#61] Make MapCluster quantity aggregation configurable`).
  Plain sentence after the tag; this repo does not use `feat:`/`fix:` prefixes.
  Branch is `feature/53-viz-025-enable-echarts-toolbox`. Issue:
  https://github.com/akvo/akvo-charts/issues/53

---

## File Structure

| File | Responsibility |
|---|---|
| `src/utils/toolbox.js` (new) | Pure: `resolveToolbox`, `toCsv`, `slugify`, plus the one DOM call `saveCsv` |
| `src/utils/__tests__/toolbox.test.js` (new) | Unit tests for resolution and CSV escaping |
| `src/utils/basicChartStyle.js` (modify) | `Toolbox` defaults, the `ToolboxPosition` table, the `CsvIcon` glyph |
| `src/hooks/useECharts.js` (modify) | Attach the resolved toolbox; add the re-render guard |
| `src/components/__tests__/Bar.test.js` (modify) | Cartesian toolbox case + the guard regression test |
| `src/components/__tests__/Pie.test.js` (modify) | Axis-less toolbox case |
| `README.md` (modify) | `toolbox` row in the shared Config table + a `#### Toolbox` subsection |
| `example/context/ChartContextProvider.js` (modify) | Seed `toolbox: true` in the playground |

---

### Task 1: Pure toolbox helpers

**Files:**
- Create: `src/utils/toolbox.js`
- Modify: `src/utils/basicChartStyle.js` (append after `Axis`, which ends at line 95)
- Test: `src/utils/__tests__/toolbox.test.js`

**Interfaces:**
- Consumes: `Toolbox`, `ToolboxPosition` and `CsvIcon` from `./basicChartStyle`.
- Produces, all named exports from `src/utils/toolbox.js`:
  - `slugify(title?: string) => string`
  - `toCsv(dimensions?: string[], source?: Array<object | Array<any>>) => string`
  - `saveCsv(csv: string, filename: string) => void`
  - `resolveToolbox({ toolbox, chartType, showAxis, dataset, title }) => object | null`

**Key detail — `source` has two shapes.** `normalizeData` always returns rows as **objects** keyed by dimension (`src/utils/normalizeData.js:22-28`), but `ScatterPlot` overrides the dataset with rows as **arrays** and no `dimensions` at all. `toCsv` must handle both, and emit no header row when `dimensions` is empty.

**Key detail — position merges are destructive only if the base carries a position.** ECharts honours a `left` and a `right` set at the same time, so a toolbox that inherited `right: 10` from a base object and then merged a `left` position renders in a place nobody asked for. `Toolbox` therefore holds no positional properties at all; every one of them comes from `ToolboxPosition`, whose entries are mutually exclusive by construction. The "should never set both a left and a right" test is what keeps that true.

- [x] **Step 1: Write the failing tests**

Create `src/utils/__tests__/toolbox.test.js`:

```js
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
      expect(resolveToolbox(bar).feature.magicType.type).toEqual(['bar', 'line']);
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
      const { feature } = resolveToolbox({ ...bar, toolbox: ['image', 'restore'] });

      expect(Object.keys(feature).sort()).toEqual(['restore', 'saveAsImage']);
    });

    it('should ignore unknown tool names', () => {
      expect(
        resolveToolbox({ ...bar, toolbox: ['image', 'teleport'] }).feature.saveAsImage
      ).toBeDefined();
      expect(resolveToolbox({ ...bar, toolbox: ['teleport'] })).toBeNull();
    });

    it('should return null when every requested tool is illegal for the chart', () => {
      expect(
        resolveToolbox({ toolbox: ['zoom', 'switch'], chartType: 'pie', showAxis: false })
      ).toBeNull();
    });

    it('should export on a white background, not the transparent chart background', () => {
      expect(resolveToolbox(bar).feature.saveAsImage.backgroundColor).toEqual('#fff');
    });

    it('should name exports after the chart title, falling back to "chart"', () => {
      expect(
        resolveToolbox({ ...bar, title: 'Sales by Region 2026!' }).feature.saveAsImage.name
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
      ['left', 'right', 'lefttop', 'righttop', 'leftbottom', 'rightbottom', 'center'].forEach(
        (position) => {
          const box = at(position);
          expect(box.left === undefined || box.right === undefined).toBe(true);
        }
      );
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
      expect(toCsv([], [[1, 2, 'a'], [3, 4, 'b']])).toEqual('1,2,a\r\n3,4,b');
    });

    it('should quote fields containing a comma, a quote or a newline', () => {
      expect(toCsv(['a'], [{ a: 'x,y' }])).toEqual('a\r\n"x,y"');
      expect(toCsv(['a'], [{ a: 'say "hi"' }])).toEqual('a\r\n"say ""hi"""');
      expect(toCsv(['a'], [{ a: 'line1\nline2' }])).toEqual('a\r\n"line1\nline2"');
    });

    it('should render null and undefined as empty cells, not as text', () => {
      expect(toCsv(['a', 'b'], [{ a: null, b: undefined }])).toEqual('a,b\r\n,');
    });

    it('should handle empty datasets', () => {
      expect(toCsv([], [])).toEqual('');
      expect(toCsv(['a'], [])).toEqual('a');
      expect(toCsv()).toEqual('');
    });
  });
});
```

- [x] **Step 2: Run the tests to verify they fail**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern=toolbox
```

Expected: FAIL — cannot resolve `../toolbox`.

- [x] **Step 3: Add the style defaults**

Append to `src/utils/basicChartStyle.js`, after the `Axis` export:

```js
// Non-positional defaults only. Position comes from ToolboxPosition, so that
// merging a 'left' position can never leave a stale 'right' behind - ECharts
// would honour both.
export const Toolbox = {
  show: true,
  itemSize: 15,
  itemGap: 10
};

// The vertically centered positions also stand the toolbar up: a horizontal
// strip floating in the middle of the plot reads as debris.
export const ToolboxPosition = {
  righttop: { right: 10, top: 0 },
  lefttop: { left: 10, top: 0 },
  rightbottom: { right: 10, bottom: 10 },
  leftbottom: { left: 10, bottom: 10 },
  right: { right: 10, top: 'middle', orient: 'vertical' },
  left: { left: 10, top: 'middle', orient: 'vertical' },
  center: { left: 'center', top: 0 }
};

// Download glyph for the custom CSV tool. ECharts custom features need an
// icon of their own; built-in features supply theirs.
export const CsvIcon = 'path://M11 2h2v8h3l-4 5-4-5h3V2zM4 17h16v2H4v-2z';
```

- [x] **Step 4: Write the implementation**

Create `src/utils/toolbox.js`:

```js
import { Toolbox, ToolboxPosition, CsvIcon } from './basicChartStyle';

const TOOLS = ['image', 'csv', 'zoom', 'switch', 'restore', 'dataView'];

const DEFAULT_POSITION = 'righttop';

// `dataView` renders from series data, which these charts express as a
// dataset + encode. `csv` covers the same need without a modal, so the
// automatic set leaves dataView out; naming it explicitly still works.
const AUTO_TOOLS = TOOLS.filter((tool) => tool !== 'dataView');

// Only bar and line are magicType targets. A pie or scatter chart has
// nothing to switch to.
const MAGIC_TYPES = {
  bar: ['bar', 'line'],
  line: ['line', 'bar']
};

export const slugify = (title) =>
  String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'chart';

const escapeCell = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  const cell = String(value);
  return /[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
};

/**
 * Rows arrive in two shapes: objects keyed by dimension (normalizeData) or
 * plain arrays with no dimensions at all (ScatterPlot's own transform).
 * A dataset without dimensions gets no header row.
 */
export const toCsv = (dimensions = [], source = []) => {
  const keys = dimensions || [];
  const rows = (source || []).map((row) =>
    Array.isArray(row) ? row : keys.map((key) => row?.[key])
  );
  const lines = keys.length ? [keys.map(escapeCell).join(',')] : [];
  rows.forEach((row) => lines.push(row.map(escapeCell).join(',')));
  return lines.join('\r\n');
};

export const saveCsv = (csv, filename) => {
  if (
    typeof document === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    return;
  }
  // The BOM makes Excel read the file as UTF-8 instead of the local codepage.
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// An object position is the consumer's own ECharts fragment and passes
// through untouched. An unknown name falls back rather than throwing: a typo
// should not blank the toolbar.
const resolvePosition = (position) => {
  if (position && typeof position === 'object') {
    return position;
  }
  return (
    ToolboxPosition[String(position || '').toLowerCase()] ||
    ToolboxPosition[DEFAULT_POSITION]
  );
};

/**
 * Turn `config.toolbox` into an ECharts toolbox option, or null when nothing
 * is enabled - null means the caller omits the key entirely rather than
 * emitting `{ show: false }`, which would still register the component.
 *
 * `true` takes every tool that works on this chart; an array takes exactly
 * what it lists, minus anything the chart cannot support; `{ tools, position }`
 * takes either of those plus a placement.
 */
export const resolveToolbox = ({
  toolbox,
  chartType,
  showAxis = true,
  dataset,
  title
} = {}) => {
  if (!toolbox) {
    return null;
  }

  // Normalize the three accepted shapes once, so nothing below sees more
  // than one of them.
  const wrapped = toolbox === true || Array.isArray(toolbox);
  const tools = wrapped ? toolbox : toolbox.tools;
  const position = wrapped ? undefined : toolbox.position;

  if (!tools) {
    return null;
  }

  const explicit = Array.isArray(tools);
  const requested = explicit ? tools : AUTO_TOOLS;
  const magicTypes = showAxis ? MAGIC_TYPES[chartType] : null;

  const legal = requested.filter((tool) => {
    if (!TOOLS.includes(tool)) {
      return false;
    }
    if (tool === 'zoom') {
      return showAxis;
    }
    if (tool === 'switch') {
      return Boolean(magicTypes);
    }
    return true;
  });

  // Restore only resets zoom and type switches. Offered automatically it is
  // dead weight without them; asked for by name it is the caller's call.
  const enabled = legal.filter(
    (tool) =>
      tool !== 'restore' ||
      explicit ||
      legal.includes('zoom') ||
      legal.includes('switch')
  );

  if (!enabled.length) {
    return null;
  }

  const name = slugify(title);
  const feature = {};

  if (enabled.includes('image')) {
    feature.saveAsImage = {
      name,
      // The chart background is transparent, and saveAsImage's 'auto' would
      // inherit it - a transparent PNG looks broken everywhere it is pasted.
      backgroundColor: '#fff',
      title: 'Save as image'
    };
  }
  if (enabled.includes('csv')) {
    feature.myCsv = {
      show: true,
      title: 'Save as CSV',
      icon: CsvIcon,
      onclick: () =>
        saveCsv(toCsv(dataset?.dimensions, dataset?.source), `${name}.csv`)
    };
  }
  if (enabled.includes('zoom')) {
    feature.dataZoom = { title: { zoom: 'Zoom', back: 'Reset zoom' } };
  }
  if (enabled.includes('switch')) {
    feature.magicType = { type: magicTypes };
  }
  if (enabled.includes('restore')) {
    feature.restore = { title: 'Restore' };
  }
  if (enabled.includes('dataView')) {
    feature.dataView = { readOnly: true, title: 'Data view' };
  }

  return { ...Toolbox, ...resolvePosition(position), feature };
};
```

- [x] **Step 5: Run the tests to verify they pass**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern=toolbox
```

Expected: PASS, all of them.

- [x] **Step 6: Lint**

```bash
npx eslint --config .eslintrc.json ./src/ --ext .js,.jsx
```

Expected: no errors.

- [x] **Step 7: Commit**

```bash
git add src/utils/toolbox.js src/utils/__tests__/toolbox.test.js src/utils/basicChartStyle.js
git commit -m "[#53] Add toolbox resolution and CSV export helpers"
```

---

### Task 2: Wire the toolbox into `useECharts`, plus README

**Files:**
- Modify: `src/hooks/useECharts.js`
- Modify: `README.md`
- Test: `src/components/__tests__/Bar.test.js`, `src/components/__tests__/Pie.test.js`

**Interfaces:**
- Consumes from Task 1: `resolveToolbox` from `../utils/toolbox`.
- Produces: every ECharts component accepts `config.toolbox` as `true` or a string array. No component file changes.

**Key detail — the re-render guard is the reason `zoom` and `switch` are usable at all.** `useECharts`'s effect depends on `getOptions`, which every component passes as a fresh inline arrow (`src/components/Bar.js:33`), so its identity changes on every render — as do `config` and `data` for any consumer passing object literals. Today that means every parent re-render runs `clear()` + `setOption`, throwing away any interaction state. Nothing held interaction state before; `zoom` and `switch` do, and both are in the `toolbox: true` set.

- [x] **Step 1: Write the failing tests**

Append to `src/components/__tests__/Bar.test.js`, inside the existing `describe('Bar chart', ...)` block. Note the import on line 2 must gain `rerender` support — `render` already returns it, so only the test below changes.

```js
  test('renders a toolbox and keeps interaction state across a re-render', async () => {
    const data = [
      { product: 'Product 1', sales: 30 },
      { product: 'Product 2', sales: 20 }
    ];
    const config = {
      title: 'Toolbox Bar',
      renderer: 'svg',
      width: 400,
      height: 400,
      toolbox: true
    };

    const ref = React.createRef();
    const { rerender } = render(
      <Bar
        config={config}
        data={data}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    const { toolbox } = ref.current.getOption();
    expect(toolbox[0].feature.saveAsImage).toBeDefined();
    expect(toolbox[0].feature.myCsv).toBeDefined();
    expect(toolbox[0].feature.magicType).toBeDefined();
    expect(toolbox[0].feature.dataZoom).toBeDefined();

    // Stand in for the user clicking the type switch, then force a re-render
    // with fresh object identities the way a parent setState would.
    ref.current.setOption({ series: [{ type: 'line' }] });
    rerender(
      <Bar
        config={{ ...config }}
        data={[...data]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current.getOption().series[0].type).toEqual('line');
    });
  });

  test('emits no toolbox key when config.toolbox is absent', async () => {
    const ref = React.createRef();
    render(
      <Bar
        config={{ title: 'No Toolbox', renderer: 'svg', width: 400, height: 400 }}
        data={[{ product: 'Product 1', sales: 30 }]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    expect(ref.current.getOption().toolbox).toBeUndefined();
  });

  test('ignores config.toolbox entirely when rawConfig is provided', async () => {
    const ref = React.createRef();
    render(
      <Bar
        config={{
          title: 'Ignored',
          renderer: 'svg',
          width: 400,
          height: 400,
          toolbox: true
        }}
        rawConfig={{
          xAxis: { type: 'category', data: ['a', 'b'] },
          yAxis: { type: 'value' },
          series: [{ data: [1, 2] }]
        }}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    // rawConfig is a branch, not a merge: the whole config path is skipped.
    // This locks the contract against a future "helpful" fill-in.
    expect(ref.current.getOption().toolbox).toBeUndefined();
  });
```

Append to `src/components/__tests__/Pie.test.js`, inside its `describe` block:

```js
  test('renders a toolbox without the axis-only tools', async () => {
    const ref = React.createRef();
    render(
      <Pie
        config={{
          title: 'Toolbox Pie',
          renderer: 'svg',
          width: 400,
          height: 400,
          toolbox: true
        }}
        data={[{ product: 'Product 1', sales: 30 }]}
        ref={ref}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    const { feature } = ref.current.getOption().toolbox[0];
    expect(feature.saveAsImage).toBeDefined();
    expect(feature.myCsv).toBeDefined();
    expect(feature.dataZoom).toBeUndefined();
    expect(feature.magicType).toBeUndefined();
    expect(feature.restore).toBeUndefined();
  });
```

- [x] **Step 2: Run the tests to verify they fail**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern="Bar|Pie"
```

Expected: FAIL — `toolbox` is undefined on the resolved option, and the re-render assertion finds `series[0].type` back at `'bar'`. The two "no toolbox" tests should already pass; they are there to stay passing.

If ECharts' `getOption()` turns out to return `toolbox: []` rather than omitting the key for a chart with no toolbox, switch those two assertions to `toHaveLength(0)` — the contract is "no toolbox component is registered", however `getOption` chooses to express it.

- [x] **Step 3: Write the implementation**

In `src/hooks/useECharts.js`, extend the import block at lines 1-4:

```js
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import transformConfig, { filterObjNullValue } from '../utils/transformConfig';
import normalizeData from '../utils/normalizeData';
import { resolveToolbox } from '../utils/toolbox';
```

Add a ref beside `chartRef` (line 13):

```js
  const chartRef = useRef(null);
  const appliedRef = useRef(null);
```

In the `config` branch, replace the `options = { ... }` assignment (lines 61-73) with:

```js
      options = {
        ...transformedConfig,
        dataset: {
          dimensions,
          source
        },
        ...getOptions({
          dimensions,
          transformedConfig,
          overrideItemStyle,
          horizontal
        })
      };

      // Built from the merged dataset, not from normalizeData: ScatterPlot
      // replaces dataset.source with its own transform, so anything built
      // earlier would export the wrong rows.
      const toolbox = resolveToolbox({
        toolbox: config?.toolbox,
        chartType: rawOverrides?.type,
        showAxis: config?.showAxis !== false,
        dataset: options.dataset,
        title: config?.title
      });
      if (toolbox) {
        options = { ...options, toolbox };
      }
```

Then replace the apply block (lines 88-95) with:

```js
    if (chartInstance) {
      // config-path options are pure data plus two functions this library owns
      // and that never vary, so omitting functions from the signature loses
      // nothing. rawConfig may hold consumer formatters closing over their own
      // state, where a stale skip would be a real regression - so it always
      // re-applies, as before.
      const isRaw = Boolean(Object.keys(rawConfig).length);
      const signature = isRaw
        ? null
        : JSON.stringify(options, (key, value) =>
            typeof value === 'function' ? undefined : value
          );

      if (isRaw || signature !== appliedRef.current) {
        appliedRef.current = signature;
        try {
          chartInstance.clear();
          chartInstance.setOption(options);
        } catch (err) {
          console.error('useECharts', err);
        }
      }
    }
```

- [x] **Step 4: Run the full library test suite**

```bash
CI=1 npx react-scripts test --env=jsdom
```

Expected: PASS. **Every pre-existing snapshot must be unchanged** — that is the regression test for "no `toolbox` key when unset". If any pre-existing `.snap` fails, do not re-record it; the omission rule has been broken and the implementation is wrong.

Two new snapshots will be written for the new Bar and Pie cases. Inspect them and confirm the toolbox SVG appears only there.

- [x] **Step 5: Update the README**

In `README.md`, add a row to the shared Config table after the `color` row at line 128:

```markdown
| `toolbox` _(optional)_ | Enables a chart toolbar. `true` turns on every tool that works on this chart type; an array turns on exactly the tools it names; an object of the form `{ tools, position }` also places it. For the tool names, the positions, and which charts support what, refer to the [Toolbox Section](#toolbox). | boolean \| array \| object | `false` |
```

Then add a `#### Toolbox` subsection immediately before `#### Example Config` (line 210):

```markdown
#### Toolbox

`toolbox: true` enables every tool that works on the chart it is given. Pass an array
to narrow it. Tools that the chart cannot support are dropped silently.

| Tool | Description | Supported by |
|------|-------------|--------------|
| `image` | Downloads the chart as a PNG on a white background. | all charts |
| `csv` | Downloads the chart data as a CSV, UTF-8 with a BOM so Excel reads it correctly. | all charts |
| `zoom` | Drag to zoom into a region of the axes, with a reset button. | charts with axes |
| `switch` | Switches the chart between bar and line. | Bar and Line charts, and their stacked variants |
| `restore` | Resets `zoom` and `switch` back to the original chart. | charts with axes |
| `dataView` | Opens the underlying numbers in a read-only table. | all charts, opt-in only |

`toolbox: true` resolves to:

| Chart | Tools |
|-------|-------|
| `Bar`, `Line`, `StackBar`, `StackLine`, `StackClusterColumn` | `image`, `csv`, `zoom`, `switch`, `restore` |
| `ScatterPlot` | `image`, `csv`, `zoom`, `restore` |
| `Pie`, `Doughnut` | `image`, `csv` |

`dataView` is never included automatically — `csv` covers the same need without a modal.
Name it explicitly to enable it.

**Position**

Pass an object to move the toolbar. `tools` takes either of the values above.

| `position` | Placement | Orientation |
|------------|-----------|-------------|
| `righttop` _(default)_ | top right | horizontal |
| `lefttop` | top left | horizontal |
| `rightbottom` | bottom right | horizontal |
| `leftbottom` | bottom left | horizontal |
| `right` | right edge, vertically centered | vertical |
| `left` | left edge, vertically centered | vertical |
| `center` | top center | horizontal |

Only the default clears the title, the legend and the plot area. Every other position
floats the toolbar over part of the chart — that is the point of moving it, but check the
result against your own titles and legend. An unrecognised name falls back to the default.

`position` also accepts an ECharts fragment, which is passed through untouched:
`position: { left: '20%', bottom: 4, orient: 'vertical' }`.

**Example of `toolbox` config**

```javascript
const config = {
  // ...other config
  toolbox: true
}

// only the two export tools
const config = {
  // ...other config
  toolbox: ['image', 'csv']
}

// moved to the bottom left
const config = {
  // ...other config
  toolbox: { tools: true, position: 'leftbottom' }
}
```

Downloaded files are named after the chart `title` (`Sales by Region` becomes
`sales-by-region.png`), falling back to `chart`. `ScatterPlot`'s CSV has no header row,
because its dataset carries no dimension names.

**`toolbox` and `rawConfig` do not combine**

`toolbox` is a `config` key, so [the usual rule](#raw-config) applies: whenever `rawConfig`
is set, the whole `config` prop is ignored — `toolbox` with it, and **even when that
`rawConfig` declares no toolbox of its own**. A `rawConfig` chart declares its toolbar the
ECharts way:

```javascript
const rawConfig = {
  // ...your ECharts option
  toolbox: {
    right: 10,
    top: 0,
    feature: {
      saveAsImage: { backgroundColor: '#fff' },
      restore: {}
    }
  }
}
```

Note that a toolbar declared this way does not keep its zoom or chart-type state across a
parent re-render, where a `config.toolbox` one does. Memoize your `rawConfig` object if
that matters.

For custom icons, per-feature ECharts options, or any toolbox feature not listed above, use
[`rawConfig`](#raw-config), which passes a complete `toolbox` option straight through.
```

- [x] **Step 6: Commit**

```bash
git add src/hooks/useECharts.js \
  src/components/__tests__/Bar.test.js \
  src/components/__tests__/Pie.test.js \
  src/components/__tests__/__snapshots__/ \
  README.md
git commit -m "[#53] Enable ECharts toolbox via config and stop redundant chart rebuilds"
```

---

### Task 3: Example app

**Files:**
- Modify: `example/context/ChartContextProvider.js`

**Interfaces:**
- Consumes from Task 2: `config.toolbox` on every ECharts component.
- Produces: the playground ships a toolbar on every chart, editable live in the JSON editor.

No new chart type, no `chartTypes` entry, no sidebar or code-block change: `toolbox` is a `config` key, and `code-block.js` emits `config={config}` generically because `config` is in its `declarationList` (`example/utils/code-block.js:26`).

**Key detail — seed the context, not the editor.** `Editor.js:56` builds only the JSON the
editor *displays*; `ChartDisplay` renders `chartConfig?.[selectedChartType] || defaultConfig`
(`example/components/ChartDisplay.js:85`), which reads the context default. Seeding the
editor alone shows `toolbox: true` in the panel while the chart draws no toolbar until the
user presses Save — verified by doing exactly that and getting a toolbar-less chart.

- [x] **Step 1: Seed the playground config**

In `example/context/ChartContextProvider.js`, add one line to `defaultConfig.config`,
after `horizontal: false`:

```js
      toolbox: true,
```

`Editor.js` needs no change: its seed spreads `...defaultConfig.config` over its own
defaults, so the context value flows through to the displayed JSON.

- [x] **Step 2: Run the example tests**

```bash
cd example && yarn test
```

Expected: PASS. If a snapshot fails **only** because a chart gained a toolbar, re-record it with `yarn test -u` and inspect the diff to confirm nothing else moved.

- [x] **Step 3: Verify it renders**

The library must be built first — the example resolves `akvo-charts` to `dist/`:

```bash
yarn build && cd example && yarn dev
```

Open the app and confirm, on a **Bar** chart:
- Five icons appear at the top right, clear of the title and legend.
- Save-as-image downloads a PNG with a **white** background, named after the chart title.
- Save-as-CSV downloads a file whose header row is the dimension names and whose rows match the chart; open it in a spreadsheet to confirm the columns split correctly.
- The type switch flips bars to a line, and restore puts it back.
- Zoom drags to a sub-range and the reset button restores the full range.

Then on a **Pie** chart: only the two export icons appear.

Then on a **ScatterPlot**: four icons, and the CSV has no header row.

Then set `"toolbox": { "tools": true, "position": "left" }` on the Bar chart and confirm
the toolbar stands up vertically down the left edge, and `"position": "leftbottom"` puts it
horizontally in the bottom left. Neither should leave a stray icon at the top right — that
would mean a positional property survived from the base defaults.

- [x] **Step 4: Decide on `dataView`**

Still in the running playground, edit the JSON config to `"toolbox": ["image", "csv", "dataView"]` on a Bar chart and open the data view.

The design flagged this as unverified: ECharts' default data view renders from series data, and these charts express their data as a `dataset` + `encode`, so the table may come out empty or malformed.

- If it renders the numbers correctly, leave the README as written.
- If it does not, add one sentence to the README's `dataView` row saying it is not
  recommended for these charts and that `csv` is the supported route, and record the
  finding in the spec's Tool resolution section.

Stop the dev server when done.

- [x] **Step 5: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add example/context/ChartContextProvider.js README.md
git commit -m "[#53] Enable the toolbox in the charts playground"
```

Drop `README.md` from the `git add` if Step 4 needed no change to it.

---

### Task 4: Rebuild `dist/`

**Files:**
- Modify: `dist/index.js`, `dist/index.modern.js`, `dist/index.css`, and their maps

The example app renders built output, not `src/` (`example/package.json:16` declares `"akvo-charts": "link:.."`, resolved through `"main": "dist/index.js"`). This repo commits `dist/` — see `[#49] Update dist to add MapCluster & apply all Map component changes` and `[#51] Update dist`.

- [x] **Step 1: Build**

```bash
yarn build
```

Expected: no errors. microbundle can fail on syntax the test runner tolerates, so this is a real check, not a formality.

- [x] **Step 2: Commit**

```bash
git add dist/
git commit -m "[#53] Update dist for toolbox support"
```

---

## Verification

Run from the repo root before considering the work done:

```bash
CI=1 npx react-scripts test --env=jsdom
npx eslint --config .eslintrc.json ./src/ --ext .js,.jsx
yarn build
cd example && yarn test
```

All four must pass. Then confirm by hand:

```bash
git status
```

`dist/` must be committed, not sitting modified in the working tree.

And confirm the backward-compatibility rule held:

```bash
git diff main --stat -- src/components/__tests__/__snapshots__/
```

Every pre-existing snapshot file should show only **additions** — the new Bar and Pie cases. Any modified or removed lines in an existing snapshot means a chart without `config.toolbox` changed, which the design forbids.

---

## Post-implementation notes

Recorded after the work landed, so the next reader does not re-derive any of it.

### `restore` blanked the chart — and the plan was complicit

Manual verification found the `restore` button wiping the chart to white. Root cause is two
facts in the ECharts source that combine badly:

1. `chartInstance.clear()` is literally `setOption({series: []}, true)`
   (`lib/core/echarts.js:793`).
2. `restore` runs `ecModel.resetOption('recreate')`, and `mountOption(true)` returns
   `optionBackup.baseOption` — **the option from the first `setOption` ever called on the
   instance** (`lib/model/OptionManager.js:128-140`). The code that would keep that backup
   current, `mergeToBackupOption`, is **commented out** (lines 104-115), so it is written
   once and never updated.

The hook did `clear()` then `setOption()`, so the first option ECharts ever saw was
`{series: []}`. Restore worked perfectly — it restored an empty chart.

**Fix:** `setOption(options, { notMerge: true })` in place of `clear()` + `setOption()`.
Both replace the option wholesale — `notMerge` is what `clear()` is built from — but it
does not register a phantom empty option first. This was latent long before this ticket;
nothing had exercised `restore`.

Two regression tests cover it, both of which fail on the old code:
`'restores to the configured chart, not to an empty one'` and
`'drops series that no longer exist when the data shrinks'` (the latter guards the reason
`clear()` was there at all).

### `myCsv` now reads the live model

Dropping `clear()` means the toolbox is no longer emptied on every pass, so ECharts' per-name
feature cache keeps the first `onclick` forever — the hazard recorded in the spec's Out of
scope became load-bearing. `myCsv.onclick` therefore reads `dataset` and `title` from the
`ecModel` argument instead of closing over them, and only falls back to the captured values.

### `useECharts.test.js` had a test that lied

`'should clean up the chart on unmount'` never tested unmount — it asserted `clear()` had been
called, which the render path did anyway. It is replaced by
`'should replace the option wholesale rather than clearing first'`.

**Separate issue, not fixed here:** the hook never disposes its ECharts instance. `echarts.init`
is called with no matching `dispose()` on unmount, so every unmounted chart leaks its instance
and its resize listeners. Out of scope for this ticket; worth its own issue.

### The example test suite cannot run

`cd example && yarn test` crashes in `@jest/reporters` -> `string-length` -> `strip-ansi`
(ESM/CJS mismatch under Node 22), before any test executes. Verified identical with and
without this branch's change, so it is pre-existing — but it means the example suite is not
part of this work's verification.

### What manual verification actually covered

Driven through real click events in the example app: the Bar toolbar renders 7 icons clear of
title and legend; Pie renders 2 (the `showAxis: false` inference); CSV downloads with a
`\ufeff` BOM, a header row from the dimensions and `\r\n` endings; PNG exports with an opaque
white corner pixel; switch -> restore returns the original bar chart.

Still unverified by anything automated: the zoom drag-select gesture.

### Known cosmetic issue

`saveAsImage`'s built-in glyph and the `CsvIcon` are both download arrows and sit adjacent,
which reads as ambiguous. A table or document glyph for CSV would be a one-line change to
`CsvIcon` in `src/utils/basicChartStyle.js`.
