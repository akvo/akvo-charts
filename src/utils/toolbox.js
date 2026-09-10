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
      // Read the dataset off the live model rather than closing over it.
      // ECharts caches a custom feature by name and never refreshes its
      // onclick, so a captured dataset would go stale as soon as the data
      // changed. `dataset` remains the fallback for the first render.
      onclick: (ecModel) => {
        const option =
          typeof ecModel?.getOption === 'function' ? ecModel.getOption() : null;
        const live = option?.dataset?.[0];
        const source = live || dataset || {};
        const file = slugify(option?.title?.[0]?.text || title);
        saveCsv(toCsv(source.dimensions, source.source), `${file}.csv`);
      }
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
