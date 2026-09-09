# Quantity Map (Weighted Clustering) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `type="quantity"` to `MapCluster` so point data carrying numeric values aggregates by **sum** across zoom levels, with circle area proportional to the aggregated value.

**Architecture:** All pure logic (number formatting, the radius scale, cluster summing, SVG building) lives in `src/utils/mapHelper.js` where it is unit-testable without Leaflet or a DOM. `src/components/MapCluster.js` keeps only thin Leaflet glue: two icon-shape wrappers and a third entry in the existing `CLUSTER_TYPE` lookup table. No new exports, no changes to `MapView`, `GeoJson`, or the choropleth path.

**Tech Stack:** React 16+, Leaflet, leaflet.markercluster, Jest via `react-scripts test` (library), Jest + Next.js (example app).

**Spec:** `docs/superpowers/specs/2026-09-09-quantity-map-design.md`

## Global Constraints

- Circle **area** is proportional to value: radius uses `Math.sqrt`, never a linear map.
- The scale domain is `[smallest individual value, sum of all values]`, computed once from the full `data` set and **never** recomputed per zoom level.
- Rows with a `point` but a missing or non-numeric value are **coerced to 0 and still rendered**, never dropped.
- `type="default"` and `type="circle"` must behave exactly as they do today. All new props are inert unless `type="quantity"`.
- Default `radius` is `[16, 56]`. Default `valueKey` is `'value'`. Default `color` is `'#4c78a8'`.
- The per-marker value rides in Leaflet marker options under the fixed key `quantityValue` — **never** under the user's `valueKey`, which could collide with real `L.Marker` options (`title`, `alt`, `opacity`, `zIndexOffset`).
- Library tests run from the repo root; example tests run from `example/`.
- Do not bump the version.
- `dist/` **must be rebuilt and committed** at the end of the work (`yarn build`). The example
  app resolves `akvo-charts` via `"link:.."` to `dist/index.js`, so it renders built output,
  not `src/` — skipping the rebuild leaves the playground silently running the old component.
  Individual tasks should not commit `dist/` churn mid-stream; it is rebuilt once at the end.
- **Commit messages must be prefixed `[#54]`** — this repo ties every commit to its
  GitHub issue (see `[#49] Update documentation for MapCluster & other Map components`).
  Plain sentence after the tag; this repo does not use `feat:`/`fix:` prefixes.
  Branch is `feature/54-support-quantity-maps`. Issue:
  https://github.com/akvo/akvo-charts/issues/54

---

## File Structure

| File | Responsibility |
|---|---|
| `src/utils/mapHelper.js` (modify) | Pure: `formatCompact`, `calculateRadiusScale`, `sumClusterValue`, `buildQuantityIcon` |
| `src/utils/__tests__/mapHelper.test.js` (modify) | Unit tests for all four |
| `src/components/MapCluster.js` (modify) | Leaflet glue: `CLUSTER_TYPE.quantity`, two icon wrappers, new props |
| `src/components/__tests__/MapCluster.test.js` (modify) | Render + snapshot for `type="quantity"` |
| `README.md` (modify) | `MapClusterQuantity` subsection under the `MapCluster` heading |
| `example/static/config.js` (modify) | New chart type key + sample data |
| `example/context/ChartContextProvider.js` (modify) | `customMap` entry for the new type |
| `example/components/ChartDisplay.js` (modify) | Render case |
| `example/components/Sidebar/index.js` (modify) | Sidebar entry + map-type membership |
| `example/utils/code-block.js` (modify) | Code-gen case + import-name fix |

---

### Task 1: Pure quantity helpers

**Files:**
- Modify: `src/utils/mapHelper.js` (append after `getColor`, which ends around line 38)
- Test: `src/utils/__tests__/mapHelper.test.js`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces, all named exports from `src/utils/mapHelper.js`:
  - `formatCompact(n: number) => string`
  - `calculateRadiusScale(values: number[], range: [number, number]) => (value: number) => number`
  - `sumClusterValue(cluster: { getAllChildMarkers(): Array<{ options: object }> }, optionKey?: string) => number`
  - `buildQuantityIcon(value: number, opts: { color: string | ((v: number) => string), formatValue: (n: number) => string, radiusScale: (v: number) => number }) => { html: string, diameter: number }`

- [ ] **Step 1: Write the failing tests**

Append inside the existing `describe('utils/mapHelper', ...)` block in `src/utils/__tests__/mapHelper.test.js`. Also extend the import on line 2 to:

```js
import {
  calculateRanges,
  getColor,
  getGeoJSONProps,
  formatCompact,
  calculateRadiusScale,
  sumClusterValue,
  buildQuantityIcon
} from '../mapHelper';
```

```js
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
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd /home/dedenbangkit/Repos/akvorepos/akvo-charts
CI=1 npx react-scripts test --env=jsdom --testPathPattern=mapHelper
```

Expected: FAIL — `formatCompact is not a function` (and the same for the other three new exports).

- [ ] **Step 3: Write the implementation**

Append to `src/utils/mapHelper.js`, after the `getColor` export and before `getGeoJSONProps`:

```js
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
 * Radius uses sqrt so that circle AREA is proportional to value.
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

export const buildQuantityIcon = (
  value,
  { color = '#4c78a8', formatValue = formatCompact, radiusScale } = {}
) => {
  const radius = typeof radiusScale === 'function' ? radiusScale(value) : 16;
  const diameter = Math.round(radius * 2);
  const fill = typeof color === 'function' ? color(value) : color;
  return {
    diameter,
    html: `<svg width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${fill}" fill-opacity="0.85" stroke="#ffffff" stroke-width="3"/><text x="50%" y="50%" fill="#ffffff" text-anchor="middle" dy=".3em" font-size="18px">${formatValue(
      value
    )}</text></svg>`
  };
};
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern=mapHelper
```

Expected: PASS, including the pre-existing `calculateRanges`, `getColor` and `getGeoJSONProps` tests.

- [ ] **Step 5: Lint**

```bash
npx eslint --config .eslintrc.json ./src/ --ext .js,.jsx
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/mapHelper.js src/utils/__tests__/mapHelper.test.js
git commit -m "[#54] Add pure helpers for quantity map sizing and formatting"
```

---

### Task 2: `type="quantity"` on MapCluster, plus README

**Files:**
- Modify: `src/components/MapCluster.js`
- Modify: `README.md`
- Test: `src/components/__tests__/MapCluster.test.js`

**Interfaces:**
- Consumes from Task 1: `formatCompact`, `calculateRadiusScale`, `sumClusterValue`, `buildQuantityIcon` from `../utils/mapHelper`.
- Produces: `MapCluster` accepting the new props `valueKey` (default `'value'`), `radius` (default `[16, 56]`), `color` (default `'#4c78a8'`), `formatValue` (default `formatCompact`), and `type="quantity"`.

**Key detail — the two render paths disagree on `iconSize` shape.** Getting this wrong silently produces wrong-sized icons:
- Cluster path: `src/components/Map/MarkerClusterGroup.js:31` calls `L.point(divIcon.iconSize, divIcon.iconSize, true)` — needs a **number**.
- Leaf path: `MarkerIcon` in `src/components/Map/Utils.js:14` passes straight to `L.divIcon` — needs an **array** `[w, h]`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/__tests__/MapCluster.test.js`, inside the existing `describe('MapCluster chart', ...)` block:

```js
  const quantityProps = {
    tile: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    },
    data: [
      { point: [-6.2251619, 106.714291], label: 'Jakarta', population: 10562088 },
      { point: [-7.2574719, 112.7520883], label: 'Surabaya', population: 2874314 },
      { point: [-6.9174639, 107.6191228], label: 'Bandung' }
    ],
    type: 'quantity',
    valueKey: 'population',
    config: {
      center: [-6.2, 106.8],
      zoom: 5,
      height: '100vh',
      width: '100%'
    }
  };

  test('renders MapCluster with type quantity', async () => {
    let instance = null;
    render(
      <MapCluster
        {...quantityProps}
        ref={(el) => {
          instance = el;
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
      expect(instance.getMap().getMaxZoom()).toEqual(19);
    });
  });

  // Bandung carries a point but no `population` field. Every path that reads a
  // value - the radius scale, the cluster sum, the leaf icon - must coerce it
  // to 0 rather than throw. The coercion itself is asserted at the unit level
  // in mapHelper.test.js; this guards the component wiring against a crash.
  test('renders without error when a row is missing the value field', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<MapCluster {...quantityProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test('matches MapCluster quantity snapshot', async () => {
    const { asFragment } = render(<MapCluster {...quantityProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern=MapCluster
```

Expected: FAIL. `type="quantity"` is not in `CLUSTER_TYPE`, so `clusterTypes[undefined]` resolves to `clusterTypes.default` — which is `undefined`, not `null` — and the new snapshot does not exist.

- [ ] **Step 3: Write the implementation**

Replace the whole of `src/components/MapCluster.js` with:

```js
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
```

Three behaviour-preserving details to verify while editing:
1. `clusterCircleIcon` is byte-for-byte unchanged.
2. `markerIcon`'s default moved from an inline object to `DEFAULT_MARKER_ICON`, resolved in `buildMarkerIcon`. The rendered result for `type="default"` and `type="circle"` is identical to before.
3. `data?.filter((d) => d?.point)` moved into `points` and is reused; the render output is the same list.

- [ ] **Step 4: Run the tests to verify they pass**

```bash
CI=1 npx react-scripts test --env=jsdom --testPathPattern=MapCluster
```

Expected: PASS. The two pre-existing `MapCluster` tests must still pass **without** their snapshot changing — if `MapCluster.test.js.snap` reports a change to the existing entries, the refactor altered behaviour and must be fixed rather than re-recorded. Only the new `matches MapCluster quantity snapshot` entry should be written.

- [ ] **Step 5: Run the full library test suite**

```bash
CI=1 npx react-scripts test --env=jsdom
npx eslint --config .eslintrc.json ./src/ --ext .js,.jsx
```

Expected: all suites pass, no lint errors.

- [ ] **Step 6: Document in the README**

Find the `#### MapCluster Notes` heading in `README.md` and insert this immediately **before** it:

````markdown
#### MapClusterQuantity

Set `type="quantity"` to aggregate by a **numeric value** instead of by marker count.
Zoomed out, nearby places merge into one circle labelled with the sum of their values and
sized by that sum. Zoomed in, clusters split and the numbers break down, down to
individual places — which stay circles, sized by their own value.

Use this when each point carries a magnitude (population, households served, budget).
Use `type="circle"` when you care about how many points there are, and `MapView`'s
`choropleth` when the thing being measured is an area rather than a place.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `valueKey` | `string` | `'value'` | Field on each row holding the number |
| `radius` | `[number, number]` | `[16, 56]` | Min and max circle radius in pixels |
| `color` | `string \| (sum) => string` | `'#4c78a8'` | Circle fill, or a function of the aggregated value |
| `formatValue` | `(n) => string` | compact (`12.4M`) | Renders the number inside the circle |

Circle **area** is proportional to value, so a place with four times the population draws
a circle twice as wide. The size scale is fixed for the lifetime of the data — its domain
runs from the smallest single value to the sum of all values — so circle sizes stay
comparable as you zoom.

Rows missing a `point` are skipped, as with any `MapCluster`. Rows that have a `point` but
a missing or non-numeric value are rendered as zero rather than dropped, so bad data shows
up on the map instead of disappearing.

```jsx
import { MapCluster } from 'akvo-charts';

const data = [
  { point: [-6.2251619, 106.714291], label: 'Jakarta', population: 10562088 },
  { point: [-7.2574719, 112.7520883], label: 'Surabaya', population: 2874314 },
  { point: [-6.9174639, 107.6191228], label: 'Bandung', population: 2444160 }
];

const Chart = () => (
  <MapCluster
    type="quantity"
    valueKey="population"
    data={data}
    tile={{
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }}
    config={{ center: [-6.2, 106.8], zoom: 5, height: '500px', width: '100%' }}
  />
);
```
````

Then add this line to the Table of Contents, immediately **before** the
`      - [MapCluster Notes](#mapcluster-notes)` line at `README.md:75`. Anchor on that
line, not on the `- [Example Usage](#example-usage)` above it - the TOC contains two
identical `Example Usage` entries (lines 74 and 85) and the second one belongs to a
different section. Keep the six-space indent:

```markdown
      - [MapClusterQuantity](#mapclusterquantity)
```

- [ ] **Step 7: Commit**

```bash
git add src/components/MapCluster.js \
  src/components/__tests__/MapCluster.test.js \
  src/components/__tests__/__snapshots__/MapCluster.test.js.snap \
  README.md
git commit -m "[#54] Add quantity cluster type to MapCluster"
```

---

### Task 3: Example app showcase

**Files:**
- Modify: `example/static/config.js:12` and end of file
- Modify: `example/context/ChartContextProvider.js:109-124`
- Modify: `example/components/ChartDisplay.js:142`
- Modify: `example/components/Sidebar/index.js:79-83` and `:116-118`
- Modify: `example/utils/code-block.js:1-10` and `:63`

**Interfaces:**
- Consumes from Task 2: `MapCluster` with `type="quantity"`, `valueKey`, `radius`, `color`, `formatValue`.
- Produces: `chartTypes.QUANTITY_MAP === 'MapClusterQuantity'`, exported from `example/static/config.js`; `quantityExampleData` exported from the same file.

**Note on the import-name bug.** `example/utils/code-block.js:4` builds import statements from `chartTypes` **values**, so the existing `MapViewChoropleth` entry already emits `import { MapViewChoropleth } from "akvo-charts"` — an export that does not exist. Step 5 fixes that for both the existing choropleth entry and the new one.

- [ ] **Step 1: Add the chart type and sample data**

In `example/static/config.js`, change the `chartTypes` object (line 1-13) so `CLUSTER_MAP` is followed by the new key:

```js
  CLUSTER_MAP: 'MapCluster',
  QUANTITY_MAP: 'MapClusterQuantity'
```

Then append to the end of the same file:

```js
export const quantityExampleData = [
  { point: [-6.2087634, 106.845599], label: 'Jakarta', population: 10562088 },
  { point: [-7.2574719, 112.7520883], label: 'Surabaya', population: 2874314 },
  { point: [-6.9174639, 107.6191228], label: 'Bandung', population: 2444160 },
  { point: [3.5951956, 98.6722227], label: 'Medan', population: 2435252 },
  { point: [-6.9666204, 110.4166595], label: 'Semarang', population: 1653524 },
  { point: [-5.1476651, 119.4327314], label: 'Makassar', population: 1423877 },
  { point: [-6.5971469, 106.8060388], label: 'Bogor', population: 1043070 },
  { point: [-6.2382905, 106.9755126], label: 'Bekasi', population: 2543676 },
  { point: [-6.4058172, 106.8185594], label: 'Depok', population: 2056335 },
  { point: [-6.1701664, 106.6403236], label: 'Tangerang', population: 1895486 },
  { point: [-7.7955798, 110.3694896], label: 'Yogyakarta', population: 373589 },
  { point: [-8.6704582, 115.2126293], label: 'Denpasar', population: 725314 }
];
```

Real cities with real populations, clustered densely around Jakarta and spread across Java, Sumatra, Sulawesi and Bali — so zooming visibly merges and splits the numbers rather than showing a flat scatter.

- [ ] **Step 2: Register the example's default props**

In `example/context/ChartContextProvider.js`, extend the import from `../static/config` to include `quantityExampleData`, then add a second entry to the `customMap` object (which currently holds only `[chartTypes.CLUSTER_MAP]`, lines 109-124), immediately after the closing brace of the `CLUSTER_MAP` entry:

```js
    [chartTypes.QUANTITY_MAP]: {
      ...defaultMapConfig,
      data: quantityExampleData,
      type: 'quantity',
      valueKey: 'population',
      radius: [16, 56],
      color: '#4c78a8'
    }
```

`formatValue` is deliberately omitted — it is a function, and the example's JSON editor serialises this object.

- [ ] **Step 3: Render it**

In `example/components/ChartDisplay.js`, add a case immediately after the existing `CLUSTER_MAP` case at line 142:

```js
      case chartTypes.QUANTITY_MAP:
        return <MapCluster {...customMap[chartTypes.QUANTITY_MAP]} />;
```

No import change is needed — `MapCluster` is already imported at line 8.

- [ ] **Step 4: Add the sidebar entry**

In `example/components/Sidebar/index.js`, add a third entry to the `subItems` array of the `chartTypes.MAP` item (after the `CLUSTER_MAP` entry ending at line 82):

```js
      {
        key: chartTypes.QUANTITY_MAP,
        name: 'Quantity Map',
        icon: null
      }
```

Then add the new key to the `isMapType` array at lines 115-119, so switching to it shows the map panel:

```js
    const isMapType = [
      chartTypes.MAP,
      chartTypes.CHOROPLETH_MAP,
      chartTypes.CLUSTER_MAP,
      chartTypes.QUANTITY_MAP
    ].includes(key);
```

Do **not** add it to the `key === chartTypes.CHOROPLETH_MAP || key === chartTypes.MAP` branch at line 140 — that one loads choropleth polygon data, which this feature does not use.

- [ ] **Step 5: Fix code generation**

In `example/utils/code-block.js`, replace the `importBlocks` block at lines 4-7 with:

```js
/**
 * Some chart types are variants of a component rather than components in
 * their own right - `MapViewChoropleth` is a configured `MapView`, and
 * `MapClusterQuantity` is a configured `MapCluster`. Without this map the
 * generated import statement names an export that does not exist.
 */
const COMPONENT_BY_TYPE = {
  [chartTypes.CHOROPLETH_MAP]: 'MapView',
  [chartTypes.QUANTITY_MAP]: 'MapCluster'
};

const importBlocks = Object.values(chartTypes).reduce((acc, value) => {
  acc[value] = `import { ${
    COMPONENT_BY_TYPE[value] || value
  } } from "akvo-charts";`;
  return acc;
}, {});
```

Then extend the `CLUSTER_MAP` case at line 63 to cover both types:

```js
    case chartTypes.CLUSTER_MAP:
    case chartTypes.QUANTITY_MAP:
      return `<MapCluster ${attributes} />`;
```

- [ ] **Step 6: Run the example tests**

```bash
cd example && yarn test
```

Expected: PASS. If a snapshot fails **only** because the sidebar gained a "Quantity Map" entry, re-record it with `yarn test -u` and inspect the diff to confirm nothing else moved.

- [ ] **Step 7: Verify it renders**

```bash
cd example && yarn dev
```

Open the app, choose GEO/Map → Quantity Map, and confirm:
- Zoomed out to all of Indonesia, circles show summed values (Java's cities merge into one large circle).
- Zooming in splits circles, and the sub-totals add back up to the parent.
- Fully zoomed in, a lone city is still a circle showing its own population, smaller than any cluster.
- The Code tab emits `import { MapCluster } from "akvo-charts";` — not `MapClusterQuantity`.

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
cd /home/dedenbangkit/Repos/akvorepos/akvo-charts
git add example/static/config.js \
  example/context/ChartContextProvider.js \
  example/components/ChartDisplay.js \
  example/components/Sidebar/index.js \
  example/utils/code-block.js
git commit -m "[#54] Add quantity map example and fix generated import names"
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

All four must pass. `yarn build` is included because `package.json`'s `test` script runs it, and microbundle can fail on syntax the test runner tolerates.
