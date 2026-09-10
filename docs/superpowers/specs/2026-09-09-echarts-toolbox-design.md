# ECharts Toolbox — Design

**Date:** 2026-09-09
**Status:** Implemented — see `docs/superpowers/plans/2026-09-09-echarts-toolbox.md`

## Problem

Every chart in `akvo-charts` is a static picture. A consumer who wants the viewer to be
able to save the chart as an image, pull the numbers out, zoom into a dense axis, or flip a
bar chart to a line chart has exactly one route: abandon the friendly `config` prop, write
a complete ECharts option by hand, and pass it as `rawConfig`. That trades away
`normalizeData`, `transformConfig`, and every default in `basicChartStyle.js` in order to
switch on one feature.

ECharts ships all of this as its `toolbox` component. Nothing in the `config` path exposes
it.

## Goal

`config.toolbox` turns on a chart toolbar, with the library — not the consumer — deciding
which tools are legal for the chart in question.

Non-goal: mirroring the ECharts `toolbox` option surface. `rawConfig` already forwards
`toolbox` verbatim and stays the escape hatch for full control, including custom icons and
per-feature options.

## Approach

A flat list of six tool names, resolved against the chart's own type.

```jsx
<Bar config={{ title: 'Sales', toolbox: true }} data={data} />
```

`toolbox: true` is the whole configuration for the common case. The library already knows
what kind of chart it is drawing — `rawOverrides.type` is `'bar'`, `'line'`, `'pie'` or
`'scatter'` on every ECharts component, and `Pie`/`Doughnut` inject `showAxis: false`
(`src/components/Pie.js:29`, `src/components/Doughnut.js:39`) — so it can select the tools
that work on that chart and drop the ones that do not. A consumer should not have to know
that `magicType` is meaningless on a pie chart.

**Rejected alternatives:**

- *Mirroring the ECharts shape* (`toolbox: { show, feature: { saveAsImage: {...} } }`).
  Consistent with how `legend` and `textStyle` map onto ECharts, but it is the shape
  `rawConfig` already provides. Two ways to write the same nested object, one of them
  half-complete.
- *A curated object with per-feature booleans* (`{ saveAsImage: true, magicType: [...] }`).
  Between the two: still makes the caller responsible for knowing which features their
  chart supports, and is longer to write for the case that matters most.
- *A sibling `config.toolboxPosition` key,* keeping `toolbox` a flat union of `true` and an
  array. Avoids the third input shape, but splits one component across two config keys and
  leaves `toolboxPosition` dangling when `toolbox` is off.
- *An `xlsx` export.* Not an ECharts feature; needs a custom tool plus a spreadsheet
  writer. The registry `xlsx` package is unmaintained, and an `.xlsx` is a zip container,
  so hand-rolling is not small. CSV opens in Excel and Sheets, needs no dependency, and the
  dataset is already in hand.

**Accepted cost:** the tool set for a given chart is inferred, not stated. A consumer
writing `toolbox: ['zoom']` on a `Pie` gets no toolbox at all and no error. The rule is
documented, and the alternative — throwing, or rendering a button that does nothing — is
worse in a charting library that is usually rendering someone else's runtime data.

## Public API

```jsx
config={{ toolbox: true }}                                  // every tool valid for this chart
config={{ toolbox: ['image','csv'] }}                       // an explicit subset
config={{ toolbox: { tools: true, position: 'leftbottom' }}} // moved
config={{ }}                                                // no toolbox (unchanged)
```

| Value | Meaning |
|---|---|
| `true` | The resolved default set for this chart type (below) |
| `string[]` | Exactly these tools, minus any illegal for this chart type |
| `{ tools, position }` | `tools` is either of the above; `position` is below |
| `false` / absent | No `toolbox` key is emitted at all |

| Tool | ECharts feature |
|---|---|
| `image` | `saveAsImage` |
| `csv` | custom (`myCsv`) — writes the dataset as a CSV download |
| `zoom` | `dataZoom` |
| `switch` | `magicType` |
| `restore` | `restore` |
| `dataView` | `dataView` |

Tool names are strings in an array rather than object keys, which sidesteps `switch` being
a reserved word — legal as a key but undestructurable.

### Position

`position` is a shortcut name, or an object passed through to ECharts untouched.

| Name | Resolves to | Orientation |
|---|---|---|
| `righttop` (default) | `right: 10, top: 0` | horizontal |
| `lefttop` | `left: 10, top: 0` | horizontal |
| `rightbottom` | `right: 10, bottom: 10` | horizontal |
| `leftbottom` | `left: 10, bottom: 10` | horizontal |
| `right` | `right: 10, top: 'middle'` | **vertical** |
| `left` | `left: 10, top: 'middle'` | **vertical** |
| `center` | `left: 'center', top: 0` | horizontal |

Names are lowercased before lookup, so `'rightTop'` works. An unknown name falls back to
the default rather than throwing — a mistyped position should not blank the toolbar.

The two vertically-centered names also flip `orient` to `'vertical'`, because a horizontal
strip floating in the middle of the plot reads as debris. That is the shortcut earning its
place: one word sets three ECharts properties.

`position: { left: '20%', bottom: 4, orient: 'vertical' }` is spread onto the toolbox
verbatim, for the cases the seven names do not cover.

**The default is the only collision-free position.** The toolbox floats above the grid, so
`left` and `right` overlay the plot area, `center` lands on the centered `Title`, and the
bottom pair sits near the x-axis label. This is a deliberate trade: a consumer asking to
move the toolbar has a layout in mind, and the library second-guessing them with automatic
`grid` adjustments would be worse than the overlap. Documented, not defended against.

### Backward compatibility

When `toolbox` is absent or `false` the emitted option contains **no `toolbox` key** —
not `{ show: false }`, which would still register the component. Every existing snapshot
must come out byte-identical. `rawConfig` is untouched.

## Tool resolution

Two inputs, both already available: `rawOverrides.type` and `config.showAxis`.

| Chart | `toolbox: true` resolves to |
|---|---|
| Bar, Line, StackBar, StackLine, StackClusterColumn | `image`, `csv`, `zoom`, `switch`, `restore` |
| ScatterPlot | `image`, `csv`, `zoom`, `restore` |
| Pie, Doughnut | `image`, `csv` |

Three rules produce that table:

1. `showAxis === false` drops `zoom` and `switch` — there are no cartesian axes to zoom or
   retype.
2. `switch` derives its own type list from the chart: `bar → ['bar','line']`,
   `line → ['line','bar']`. `pie` and `scatter` are not `magicType` targets, so `switch` is
   dropped for them.
3. `restore` is auto-included only when `zoom` or `switch` survived — it has nothing to
   restore otherwise.

An explicit array is honoured as written, minus anything rules 1 and 2 reject. Rule 3 does
not apply to an explicit array: a caller who lists `restore` gets it.

`dataView` is never in the `true` set. `csv` covers "give me the numbers" without a modal,
and the default ECharts data view renders from series data, which these charts express as
a `dataset` + `encode` — it must be checked against a real chart in the example app before
being recommended. It stays available by name for callers who want it.

## Precedence with `rawConfig`

`rawConfig` is not merged with `config` — it is a branch (`src/hooks/useECharts.js:31`).
When `rawConfig` is non-empty the entire `config` path, `resolveToolbox` included, never
executes. The README already states the rule for every other key
(*"When `rawConfig` is provided, it will override the default `data` and `config`
props"*), and `toolbox` simply inherits it.

| `config.toolbox` | `rawConfig` | Result |
|---|---|---|
| set | absent or `{}` | The shortcut toolbox |
| absent | carries `toolbox` | That toolbox, verbatim; the library resolves nothing |
| set | carries `toolbox` | **`rawConfig` wins outright** — `config.toolbox` is never evaluated |
| set | non-empty, **no** `toolbox` | **No toolbox at all** |
| absent | absent | No toolbox |

Only two things cross the boundary, both pre-existing:

- **`config` into the `rawConfig` path:** `width`, `height`, `theme` and `renderer` only.
  They are read at `echarts.init` (`useECharts.js:18-25`), outside the branch.
- **The library into `rawConfig`:** `rawOverrides` merges into each `series` entry, so a
  `<Bar rawConfig={…}/>` still knows it is a bar. Only when `rawConfig.series` exists;
  without it, `rawConfig` passes through untouched.

The fourth row is the one that will generate a bug report. Setting `toolbox` in `config`
while passing any non-empty `rawConfig` silently produces nothing. That is exactly how
`title`, `legend` and `color` already behave, but `toolbox` is the first `config` key
people will reach for *while* using `rawConfig` — wanting a save button is orthogonal to
wanting hand-written axes. It gets an explicit warning in the README rather than a
behaviour change.

**Decision: no per-key exception.** Letting `config.toolbox` fill in when `rawConfig` omits
one is about three lines, and is still the wrong trade. The model today is one sentence —
*`rawConfig` replaces `config`* — already documented. Carve out one key and the honest
statement becomes *"`rawConfig` replaces `config`, except `width`, `height`, `theme`,
`renderer` and `toolbox`"*, which invites the same question about every remaining key. A
`rawConfig` consumer is already writing ECharts options by hand; eight more lines for a
toolbar is not what stands in their way.

**Consequence worth stating:** the re-render guard is `config`-path only, so a `rawConfig`
toolbox carrying `dataZoom` or `magicType` still loses its interaction state on a parent
re-render. Only the shortcut form gets that protection. This follows from the guard's own
constraint, not from a preference — see below.

## Placement: `useECharts`, not `transformConfig`

The toolbox is assembled **after** `getOptions` has merged, inside `useECharts`.

`transformConfig` looks like the natural home — every other option section is built there —
but the CSV tool needs the dataset that the chart actually renders, and that is not settled
until after the component's own `getOptions` contributes. `ScatterPlot` is the proof: it
does not pass `data` to `useECharts` at all and replaces `dataset.source` wholesale with
its own transform (`src/components/ScatterPlot.js:56`). A toolbox built inside
`transformConfig` from `normalizeData(data)` would hand ScatterPlot an empty CSV.

Building from the merged `options.dataset` is correct for every component, and leaves
`transformConfig` untouched.

`ScatterPlot`'s dataset carries a `source` but no `dimensions`, so its CSV has no header
row. Acceptable; noted in the README.

## The re-render hazard

`useECharts` runs `chartInstance.clear()` followed by `setOption` on every effect pass
(`src/hooks/useECharts.js:88-95`), and the effect's dependencies include `getOptions`,
which every component passes as a fresh inline arrow (`src/components/Bar.js:33`). Its
identity changes on every render, as do `config` and `data` for any consumer passing object
literals. So **any parent re-render rebuilds the chart from scratch.**

That has been invisible until now because nothing in the library holds interaction state.
`zoom` and `switch` do. Without a fix, an unrelated `setState` in the host app silently
throws away the viewer's zoom selection and snaps a switched line chart back to bars — and
both tools are in the `toolbox: true` default set.

**Fix:** skip the rebuild when the computed option has not changed.

```
serialize options (functions omitted)
  -> unchanged since last applied?  do nothing
  -> changed?                       clear() + setOption(), record it
```

Applied to the **`config` path only.** Options built from `config` are pure data plus two
functions the library itself owns and that never vary: `ScatterPlot`'s
`label.formatter` and the CSV tool's `onclick`. Both are fully determined by values that
*are* in the serialized output — the dataset, the title — so omitting functions from the
comparison loses nothing.

The `rawConfig` path keeps today's unconditional `clear()` + `setOption`. A consumer's
`rawConfig` may hold formatters closing over their own state, where a changed closure is
invisible to serialization and skipping the update would be a real regression. `rawConfig`
users configure their own toolbox and can memoize their own option object.

This is a root-cause fix in one place rather than a `useCallback` added to each of the
eight components, and it also removes a per-render full chart rebuild that has been
happening all along.

## Implementation units

### `src/utils/toolbox.js` (new)

Pure and unit-testable, no Leaflet-style DOM entanglement except the one download call.

- `resolveToolbox({ toolbox, chartType, showAxis, dataset, title })` → an ECharts `toolbox`
  option object, or `null` when nothing is enabled. `null` means the caller omits the key.
  Its first act is to normalize the three accepted `toolbox` shapes into
  `{ tools, position }`, so every rule below it sees one shape.
- `toCsv(dimensions, source)` → string. The correctness-sensitive part:
  - header row from `dimensions` when present, omitted when not;
  - a field containing `,`, `"`, `\r` or `\n` is wrapped in quotes and its own quotes
    doubled;
  - `null`/`undefined` render as empty, not `"null"`;
  - `\r\n` line endings.
- `saveCsv(csv, filename)` → prepends a `\ufeff` BOM so Excel reads UTF-8 correctly (Akvo
  data is routinely non-ASCII), builds a `text/csv` Blob, triggers an anchor download and
  revokes the object URL. No-ops when `document` is undefined.

Filenames come from a slug of `config.title`, falling back to `chart`. The same slug feeds
`saveAsImage`'s `name`, so the two exports match.

### `src/utils/basicChartStyle.js`

A `Toolbox` default alongside the existing `Legend`, `Title`, `Grid` exports, carrying only
the non-positional properties (`show`, `itemSize`, `itemGap`), and a `ToolboxPosition`
lookup table holding the seven named positions. Keeping position out of the base object
matters: merging `{ right: 10 }` with a `left` position would leave both set, and ECharts
would honour both. The `path://` glyph for the CSV tool's icon lives here too, beside the
other visual constants.

`saveAsImage` gets `backgroundColor: '#fff'`. The library-wide `backgroundColor` is
`transparent` (`basicChartStyle.js:1`) and ECharts' `saveAsImage` defaults to `'auto'`,
which would export a transparent PNG that looks broken in Slack, Word and PowerPoint.

### `src/hooks/useECharts.js`

- In the `config` branch, after `options` is assembled: call `resolveToolbox` with
  `config.toolbox`, `rawOverrides?.type`, `config.showAxis`, `options.dataset` and
  `config.title`; attach the result under `toolbox` when it is not `null`.
- Add the serialization guard around `clear()` + `setOption` for this branch only, holding
  the last applied string in a ref.

No component files change.

## Testing

Tests are written before the implementation, per the repo's TDD convention.

1. **`src/utils/__tests__/toolbox.test.js`** — the primary coverage.
   `resolveToolbox`: the `true` default set for each of `bar`, `line`, `pie`, `scatter`;
   `showAxis: false` drops `zoom` and `switch`; `switch` emits `['bar','line']` for a bar
   chart and `['line','bar']` for a line chart; an explicit array is honoured; an explicit
   array of only illegal tools returns `null`; `restore` is auto-added with `zoom`/`switch`
   and not without; `false`/absent returns `null`; the `{ tools, position }` form resolves
   its `tools` identically to the bare forms.
   Position: each of the seven names maps to its ECharts properties; `left` and `right`
   also set `orient: 'vertical'`; a name is lowercased before lookup; an unknown name falls
   back to the default; an object is spread through verbatim; no named position ever emits
   both a `left` and a `right`.
   `toCsv`: a field containing a comma, one containing a quote, one containing a newline,
   `null` and `undefined` cells, a dataset with no `dimensions`, an empty `source`.
2. **`src/components/__tests__/Bar.test.js`** and **`Pie.test.js`** — one `toolbox: true`
   case each, covering the cartesian and axis-less branches end to end.
3. **Snapshots** — the new cases are added; **every pre-existing snapshot must be
   unchanged**, which is the regression test for the "no `toolbox` key when unset" rule.

The download itself is not tested — `URL.createObjectURL` does not exist in jsdom, and the
value is in `toCsv`, which is pure.

## Example app

No new chart type, no `chartTypes` entry, no sidebar wiring: `toolbox` is a `config` key,
and the playground's JSON editor already renders arbitrary `config`. `code-block.js` emits
`config={config}` generically because `config` is in its `declarationList`
(`example/utils/code-block.js:26`), so the generated snippet needs no change either.

| File | Change |
|---|---|
| `example/components/Editor.js:56` | Seed `toolbox: true` beside `horizontal: false` so every chart in the playground ships the toolbar and it is editable live |

Verifying `dataView` against a real `dataset` + `encode` chart happens here, by typing it
into the editor, before the README recommends it.

## Documentation

A shared `toolbox` row in each ECharts component's Props table in `README.md`, pointing at
one new subsection that carries the tool-name table, the resolution rules, and the note
that `rawConfig` accepts a full ECharts `toolbox` for anything beyond them.

## Build output

`dist/` **must be rebuilt and committed** as part of this work. The example app declares
`"akvo-charts": "link:.."` (`example/package.json:16`), which resolves through
`package.json`'s `"main": "dist/index.js"` — so the playground renders **built output, not
`src/`**. A branch that changes `src/` without rebuilding `dist/` leaves the example running
the previous version, silently and with no error.

## Out of scope

- Version bump.
- Custom icons and per-feature ECharts options (`saveAsImage.pixelRatio`,
  `dataView.optionToContent`, …) — `rawConfig`.
- Adjusting `grid` or `legend` to make room for a moved toolbox.
- **Custom buttons carrying a consumer callback** — `toolbox: { custom: [{ name, title,
  icon, onClick }] }`, for firing an API call to generate a report and the like. ECharts
  supports this natively: a `feature` key beginning with `my` is treated as a user feature
  (`isUserFeatureName` in `lib/component/toolbox/ToolboxView.js`) and its `onclick` is
  bound as `onclick(ecModel, api, iconName)` with `this` set to the feature object;
  `ecModel.getOption()` reaches the dataset from inside it. **`rawConfig` already carries
  this today**, with no library code at all.

  Folding it into the `config` shortcut is a follow-up ticket rather than a small addition,
  because of how ECharts caches features. Feature instances are stored per name and reused
  across renders — only the create branch reads `option.onclick`, while the update branch
  refreshes `model`, `ecModel` and `api` but never `onclick`. A plain `setOption` therefore
  leaves the first closure bound for the life of the view; today only `chartInstance.clear()`
  rebuilds it, and the re-render guard skips exactly that call. A handler closing over React
  state would go stale, silently. `myCsv` is unaffected — its closure captures the dataset,
  and the guard only skips when the serialized option, dataset included, has not changed.

  The fix is a handler ref: keep the latest callback in a ref and register a stable wrapper
  that reads it. Five lines, plus a test for the stale path — small, but it has to ship
  *with* the feature, not after it.
- `xlsx` export. If real demand appears it is a new tool name against the same resolver,
  not a rework.
- Preserving zoom or switch state across a genuine `data` change. The guard preserves it
  across incidental re-renders; a real data change legitimately rebuilds the chart.
