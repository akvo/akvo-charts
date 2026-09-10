# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`akvo-charts` — a React component library published to npm. Two families of components:
ECharts wrappers (Bar, Line, Pie, …) and Leaflet map wrappers (MapView, MapCluster, plus a
lower-level `Map` namespace). React is a peer dependency; the package is bundled with
`microbundle-crl` from `src/index.js` into `dist/`.

## Commands

```bash
yarn build            # microbundle build -> dist/ (cjs + modern esm + css)
yarn start            # microbundle watch
yarn test             # test:unit -> test:lint -> test:build (what CI runs)
yarn test:unit        # jest via react-scripts, CI=1
yarn test:watch
yarn test:lint        # eslint ./src

yarn test:unit -- -t "renders Bar component"        # single test by name
yarn test:unit -- src/components/__tests__/Bar.test.js   # single file
yarn test:unit -- -u                                # update snapshots

docker compose up example   # runs the docs site on :3000 (main.sh)
```

Example/docs app (Next.js static export) lives in `example/`:
`cd example && yarn install && yarn dev` (its own jest: `yarn test`).

## Gotchas

- **`dist/` is committed.** Builds produce diffs in `dist/index.js`, `dist/index.modern.js`,
  `dist/index.css` and their maps. Expect them in `git status`; keep them in the commit
  that changes `src/`.
- **The example app consumes `dist/`, not `src/`.** It resolves `akvo-charts` via
  `link:..`. Run `yarn build` at the repo root before checking a `src/` change in the docs
  site, or you are looking at stale output.
- Tests mock canvas (`jest-canvas-mock`), so component tests pass `renderer: 'svg'`.
- Map components need `window`; the docs site loads them via `next/dynamic` with `ssr: false`.

## Architecture

### ECharts side

`src/hooks/useECharts.js` is the single integration point — every chart component is a thin
shell around it. It owns two mutually exclusive paths:

1. **`config` + `data`** (the friendly API): `utils/normalizeData.js` turns any of three
   accepted data shapes (2D array, row-based object array, column-based object) into an
   ECharts `dataset` `{dimensions, source}`; `utils/transformConfig.js` maps the small
   `config` prop onto a full ECharts option, filling gaps from the defaults in
   `utils/basicChartStyle.js`. The component's own `getOptions({dimensions,
   transformedConfig, overrideItemStyle, horizontal})` then contributes `series` and any
   per-chart overrides.
2. **`rawConfig`** (escape hatch): passed straight to ECharts, with the component's
   `rawOverrides` merged into each `series` entry so a `rawConfig` still knows it is a bar
   or a line.

Conventions that matter when editing this side:

- `dimensions[0]` is the category dimension (`sortKeys` in `normalizeData` promotes the
  first non-numeric key); series are always `dimensions.slice(1)`.
- `null` in a config sub-object means "unset, fall through to the default" —
  `filterObjNullValue` strips nulls before merging. Don't use `undefined` for this.
- Every chart is `forwardRef` + `useImperativeHandle(ref, () => chartInstance)`, exposing
  the raw ECharts instance to consumers.

**Adding a chart type:** new file in `src/components/`, define a local `getOptions`, wire it
through `useECharts` with a `rawOverrides.type`, export from `src/index.js`, add a snapshot
test, document it in `README.md`, and register it in `example/static/config.js`
(`chartTypes` plus the relevant exclude lists) and `example/components/ChartDisplay.js`.

### Leaflet side

`src/context/LeafletProvider.js` imperatively creates the `L.map` in a layout effect and
publishes the map ref through context (`useLeaflet`). Everything under
`src/components/Map/` (TileLayer, Marker, GeoJson, LegendControl, MarkerClusterGroup,
Container) is a declarative wrapper that renders nothing and attaches its layer to the map
from context — that is why they only work inside a provider. `MapView` and `MapCluster` are
the batteries-included compositions; the `Map` namespace export exists for consumers
building a fully custom map. `src/utils/mapHelper.js` holds the choropleth range/colour maths
and the quantity-cluster radius scaling — read the comments there before touching the
`sum` vs `average` aggregation, the domain choice is load-bearing.

`MapView` exposes `{ getMap() }` via ref, not the Leaflet map directly.

## Docs and release

`README.md` is the public API reference and is large — every new prop or component belongs
in it, matching the existing per-component "Props / Example usage / Example usage of
`rawConfig`" structure. The rendered docs site is the `example/` app.

`./release.sh` bumps `package.json`, tags, and pushes. The tag must equal the
`package.json` version or `release.yml` refuses to publish. Pushing a `*.*.*` tag triggers
both npm publish (Trusted Publishing / OIDC, no token) and the GitHub Pages docs deploy.
