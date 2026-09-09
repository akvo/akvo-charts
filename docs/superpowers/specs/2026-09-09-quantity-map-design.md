# Quantity Map (Weighted Clustering) — Design

**Date:** 2026-09-09
**Status:** Approved, ready for implementation planning

## Problem

`akvo-charts` can encode a quantity on a map in exactly one way today: `MapView`'s
`choropleth`, which fills GeoJSON **polygon areas** with a color ramp. That is the wrong
encoding when the measured thing is a **place** — a village, a school, a city — rather
than an area, and it is misleading when polygon sizes vary widely.

`MapCluster` already aggregates points by zoom level, but it aggregates by **count**:
`clusterCircleIcon` labels each cluster with `cluster.getChildCount()` at a fixed
`radius = 40` (`src/components/MapCluster.js:46`). There is no way to say "these points
each carry a number; show me the sum, and size the circle by it."

## Goal

Add a **quantity map**: point data where each row carries a numeric value. Zoomed out,
nearby places merge into one circle labelled with the **sum** of their values, sized by
that sum. Zoomed in, clusters split and the numbers break down into smaller sub-totals,
down to individual places.

Non-goal: anything involving polygons, `mapKey` joins, or `choropleth`. Those paths are
untouched.

## Approach

Add a third cluster type to `MapCluster` rather than creating a new component.

`CLUSTER_TYPE` (`src/components/MapCluster.js:19`) is already a lookup table built as an
extension point, and `MapCluster` owns everything hard about this feature: the
markercluster group, zoom-driven aggregation, per-cluster `iconSize` support
(`src/components/Map/MarkerClusterGroup.js:29`), and marker options riding through
`fnMarker`. A user comparing "cluster by count" against "cluster by value" should find
both in one component.

**Rejected alternatives:**

- *A separate `MapQuantity` component.* Cleaner prop surface, but duplicates
  `MapCluster`'s container and cluster-group wiring and adds a fourth map component to an
  already long README.
- *Extracting shared cluster-icon primitives, then building both.* Refactors working code
  for a payoff only collected on a third cluster type. YAGNI.

**Accepted cost:** today `type` controls only the *cluster* icon, while the leaf marker is
controlled by the separate `markerIcon` prop. Because leaf markers must also render as
circles (below), `type="quantity"` supplies a circle default for `markerIcon`. An
explicitly passed `markerIcon` still overrides it. This makes the prop interaction less
obvious than it is today; it is the price of approach A.

## Public API

```jsx
<MapCluster
  data={data}
  type="quantity"
  valueKey="population"
  radius={[16, 56]}
  color="#4c78a8"
  formatValue={(n) => n.toLocaleString()}
/>
```

| Prop | Default | Purpose |
|---|---|---|
| `valueKey` | `'value'` | Field on each row holding the number |
| `radius` | `[16, 56]` | Min/max circle radius in px |
| `color` | `'#4c78a8'` | A color string, or `(sum) => color` for a value-driven ramp |
| `formatValue` | `formatCompact` | Renders the number inside the circle |

### Data contract

Unchanged from what `MapCluster` accepts today, with a numeric field added:

```js
[{ point: [-6.2, 106.8], name: 'Jakarta', population: 10562088 }, ...]
```

- Rows without `point` are already filtered out (`src/components/MapCluster.js:87`).
- Rows with a `point` but a missing or non-numeric value are **coerced to 0 and still
  rendered**. A silently vanishing place is a worse failure than a visible zero. This is a
  deliberate choice: malformed data appears as tiny circles rather than raising an error.

### Behaviour at leaf level

When a circle contains exactly one place it stays a circle, showing its own value, sized
by its own value. The map therefore reads as one continuous size scale from country level
down to village level, and the eye never switches visual language mid-zoom.

`renderPopup` continues to work on leaf circles, so click-for-detail is unaffected.

### Backward compatibility

`type="default"` and `type="circle"` behave exactly as today. `valueKey`, `radius`,
`color` and `formatValue` are ignored unless `type="quantity"`.

## Sizing scale

Circle **area** is proportional to value, so radius uses a square root — otherwise a place
with 4x the population appears 16x larger:

```
r(v) = rMin + (rMax - rMin) * sqrt((v - vMin) / (vMax - vMin))
```

The domain is computed **once from the full `data` set** as
`[smallest individual value, sum of all values]`, and is **not** recomputed per zoom level.

The sum is exactly what the single fully-zoomed-out circle displays, so the largest circle
reaches `rMax` and every other circle sits proportionally below it. Rescaling per zoom
would resize circles during pan and zoom, and a circle's size would stop being comparable
across views.

**Known trade-off:** with data spanning orders of magnitude (12.4M down to 180k),
deep-zoom circles cluster near `rMin`. `rMin = 16px` keeps them legible and `radius` is
configurable. If real data proves this too flat, substituting `log` for `sqrt` is a
one-line change — the cartographically correct default ships first.

Edge cases the scale must handle: empty data, a single row, and all-equal values (where
`vMax === vMin` would divide by zero — return `rMin`).

## Implementation units

### `src/utils/mapHelper.js` (pure, unit-testable)

Placed beside the existing `calculateRanges` and `getColor`.

- `calculateRadiusScale(values, [rMin, rMax])` → returns `(value) => radius`.
  `values` is the array of **individual** row values. The function derives its own domain
  from them: `vMin = Math.min(...values)` and `vMax = sum(values)`. It does not receive a
  pre-computed domain, and `vMax` is deliberately the sum rather than the maximum, because
  the largest circle ever drawn is the fully-collapsed cluster holding every point.
- `formatCompact(n)` → `12.4M`, `890K`, `1.2K`

Keeping the scale free of Leaflet makes the most important logic testable without a DOM.

### `src/components/MapCluster.js`

- `quantityCircleIcon(...)` beside the existing `clusterCircleIcon`, emitting the same
  SVG-in-a-divIcon shape: one filled `<circle>` plus a centered `<text>`.
- Register `CLUSTER_TYPE.quantity = 2`.
- Sum a cluster's value via `cluster.getAllChildMarkers()`, reading `marker.options`
  (values reach there because `fnMarker` spreads unknown props into `L.marker` options —
  `src/components/Map/Utils.js:47`).
- Supply the leaf circle default for `markerIcon` when `type === 'quantity'`.

### iconSize shape hazard

The two render paths disagree on the shape of `iconSize`, and mismatching them produces
silently wrong-sized icons:

- **Cluster path** — `src/components/Map/MarkerClusterGroup.js:31` calls
  `L.point(divIcon.iconSize, divIcon.iconSize, true)`, expecting a **number** (matching
  `clusterIcon`'s default `iconSize: 60`).
- **Leaf path** — `MarkerIcon` (`src/components/Map/Utils.js:14`) passes straight to
  `L.divIcon`, expecting an **array** (matching `markerIcon`'s default `[32, 32]`).

The shared icon builder takes a `diameter` and each call site emits the shape its own path
requires.

## Testing

Tests are written before the implementation, per the repo's TDD convention.

1. **`src/utils/__tests__/mapHelper.test.js`** — the primary coverage.
   `calculateRadiusScale`: the smallest individual value maps to `rMin`; the sum of all
   values maps to `rMax`; the radius above the `rMin` floor scales with the square root of
   the normalized value, so a value at 1/4 of the domain sits at half the available radius
   range (note the floor means total radius is *not* itself proportional to sqrt(v));
   single-row data; all-equal values (guard against divide-by-zero, return `rMin`);
   empty array. `formatCompact`: boundary values around 1K, 1M, and
   sub-1K.
2. **`src/components/__tests__/MapCluster.test.js`** — extend the existing file:
   `type="quantity"` renders; `default` and `circle` types are unchanged; a row missing
   `valueKey` is rendered rather than dropped.
3. **Snapshot** — `__snapshots__/MapCluster.test.js.snap` picks up the new case.

## Example app

Follows the `MapViewChoropleth` precedent, which already establishes that a variant of an
existing map gets its own showcase entry. `sidebarList` in
`example/components/Sidebar/index.js` is a hand-maintained array and requires explicit
wiring.

| File | Change |
|---|---|
| `example/static/config.js:12` | Add `QUANTITY_MAP: 'MapClusterQuantity'` to `chartTypes` |
| `example/static/config.js` | Sample data: real Indonesian cities with populations, so zoom aggregation is visibly meaningful rather than random dots |
| `example/components/ChartDisplay.js:142` | New `case` rendering `<MapCluster type="quantity" ... />` |
| `example/utils/code-block.js:63` | Emit `<MapCluster ... />` for the new type, joining the existing `CLUSTER_MAP` case |
| `example/components/Sidebar/index.js` | Add a `sidebarList` entry for the new type |

## Documentation

A `MapClusterQuantity` subsection under the existing `MapCluster` README heading:
the four new props, the data shape, and guidance on choosing quantity clustering over
count clustering.

## Out of scope

- `dist/` — built by `yarn build` at release time (`release.sh`).
- Version bump.
- Bivariate encoding (size + color as independent variables). Accepting a function for
  `color` leaves the door open without building it now.
