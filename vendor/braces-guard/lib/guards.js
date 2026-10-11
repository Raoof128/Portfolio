'use strict';

// Local security prototype based on MIT braces3.0.3 (Jon Schlinkert).
// GHSA-vfj7-8cjw-p6xm concerns recursive AST exhaustion.
// Hard tooling ceilings also prevent numeric/cartesian output exhaustion.
const MAX_DEPTH = 128;
const MAX_VISITS = 20000;
const MAX_OUTPUT_UNITS = 1048576;

const fail = (code, message) => {
  const error = new RangeError(message);
  error.code = code;
  throw error;
};

const depth = value => {
  if (value > MAX_DEPTH) {
    fail('ERR_BRACES_DEPTH', `Brace traversal depth exceeds ${MAX_DEPTH}`);
  }
};

const primitive = (value, field, code, allowFunction = false) => {
  if (value !== null && (typeof value === 'object' || (typeof value === 'function' && !allowFunction))) {
    const error = new TypeError(`Expected primitive ${field}`);
    error.code = code;
    throw error;
  }
};

const options = value => {
  if (value == null) return;
  // fill-range deliberately accepts a step transform function. JSON-like
  // arrays/objects are not numeric inputs and can recurse in native coercion.
  primitive(value.step, 'options.step', 'ERR_BRACES_OPTION', true);
  primitive(value.rangeLimit, 'options.rangeLimit', 'ERR_BRACES_OPTION');
  // parse's maxLength branch accepts only typeof number, so a nonprimitive
  // maxLength is ignored without coercion exactly as in the upstream parser.
};

// Count occurrences, not only distinct objects: a small shared DAG can otherwise
// cause exponentially repeated work. Active-path membership permits sharing
// while rejecting a cycle along the actual traversed child edges.
const ast = root => {
  const active = new Set();
  const stack = [{ node: root, depth: 0, entered: false, index: 0 }];
  let visits = 0;
  let textUnits = 0;
  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (!frame.entered) {
      const node = frame.node;
      if (node === null || typeof node !== 'object') {
        throw new TypeError('Expected an AST node object');
      }
      depth(frame.depth);
      if (++visits > MAX_VISITS) fail('ERR_BRACES_VISITS', 'Brace traversal visit limit exceeded');
      if (active.has(node)) fail('ERR_BRACES_CYCLE', 'Cyclic brace child graph');
      // Native Array.toString can overflow independently of child traversal.
      // Parsed AST values are strings/numbers; arbitrary object-valued text or
      // numeric metadata is unsupported rather than implicitly coerced.
      for (const field of ['value', 'ranges', 'commas']) {
        primitive(node[field], `AST.${field}`, 'ERR_BRACES_AST_FIELD');
      }
      if (typeof node.value === 'string') textUnits += node.value.length;
      if (textUnits > MAX_OUTPUT_UNITS) fail('ERR_BRACES_OUTPUT', 'Brace AST text length limit exceeded');
      if (node.nodes !== undefined && !Array.isArray(node.nodes)) {
        throw new TypeError('Expected AST nodes to be an array');
      }
      frame.children = node.nodes || [];
      frame.entered = true;
      active.add(node);
    }
    if (frame.index < frame.children.length) {
      stack.push({ node: frame.children[frame.index++], depth: frame.depth + 1, entered: false, index: 0 });
    } else {
      active.delete(frame.node);
      stack.pop();
    }
  }
};

const arrays = (...roots) => {
  const active = new Set();
  const stack = [{ array: roots, depth: 0, entered: false, index: 0 }];
  let visits = 0;
  while (stack.length) {
    const frame = stack[stack.length - 1];
    if (!frame.entered) {
      depth(frame.depth);
      if (active.has(frame.array)) fail('ERR_BRACES_CYCLE', 'Cyclic brace array graph');
      frame.entered = true;
      active.add(frame.array);
    }
    if (frame.index < frame.array.length) {
      if (++visits > MAX_VISITS) fail('ERR_BRACES_VISITS', 'Brace array visit limit exceeded');
      const value = frame.array[frame.index++];
      if (Array.isArray(value)) stack.push({ array: value, depth: frame.depth + 1, entered: false, index: 0 });
    } else {
      active.delete(frame.array);
      stack.pop();
    }
  }
};

// Expand follows parent edges until a brace/root is reached. Normal parsed ASTs
// have child->parent links; validating all metadata as one DAG would reject them.
const parentStep = (node, seen, value) => {
  depth(value);
  if (seen.has(node)) fail('ERR_BRACES_CYCLE', 'Cyclic brace parent chain');
  seen.add(node);
};

// Count every produced occurrence before callers hash/deduplicate it. String
// length is UTF-16 code units; this cap is deliberately independent of bytes,
// rangeLimit:false, and whether ropes share their underlying literal storage.
const budget = () => ({ results: 0, units: 0 });
const output = (value, state = budget()) => {
  arrays(value);
  const stack = [value];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      for (let i = item.length - 1; i >= 0; i--) stack.push(item[i]);
      continue;
    }
    if (item === undefined) continue;
    if (++state.results > MAX_VISITS) fail('ERR_BRACES_OUTPUT', 'Brace output count limit exceeded');
    if (typeof item === 'string') state.units += item.length;
    if (state.units > MAX_OUTPUT_UNITS) fail('ERR_BRACES_OUTPUT', 'Brace aggregate output length limit exceeded');
  }
  return value;
};

// fill-range can loop forever when numeric endpoints round to the same unsafe
// integer. Its stepped regex path also enumerates every value. Guard those
// actual enumeration paths before calling it, while retaining efficient huge
// step-one regex ranges. BigInt avoids rounding the inclusive cardinality.
const range = (args, opts = {}) => {
  const [start, end] = args;
  const valid = value => typeof value === 'number' || (typeof value === 'string' && value !== '');
  if (!valid(start) || !valid(end)) return;
  const numeric = value => Number.isInteger(Number(value));
  const bothNumeric = numeric(start) && numeric(end);
  if (bothNumeric && (!Number.isSafeInteger(Number(start)) || !Number.isSafeInteger(Number(end)))) {
    fail('ERR_BRACES_RANGE', 'Brace numeric endpoints must be safe integers');
  }
  const selectedStep = args[2] || opts.step || 1;
  if (typeof selectedStep === 'function' || typeof selectedStep === 'symbol') return;
  const numericStep = Number(selectedStep);
  if (!Number.isInteger(numericStep)) return;
  const step = Math.max(Math.abs(numericStep), 1);
  if (!Number.isInteger(step)) return; // upstream handles invalid primitive steps
  if (opts.toRegex && step === 1) return;
  let distance;
  if (bothNumeric) {
    const a = BigInt(Number(start));
    const b = BigInt(Number(end));
    distance = a > b ? a - b : b - a;
  } else {
    if ((!numeric(start) && String(start).length > 1) || (!numeric(end) && String(end).length > 1)) return;
    distance = BigInt(Math.abs(String(start).charCodeAt(0) - String(end).charCodeAt(0)));
  }
  const count = distance / BigInt(step) + 1n;
  if (count > BigInt(MAX_VISITS)) {
    fail('ERR_BRACES_RANGE', 'Brace enumerated range exceeds tooling output limit');
  }
  if (bothNumeric) {
    const strings = [String(start), String(end), String(selectedStep)];
    const padded = strings.some(value => {
      if (value[0] === '-') value = value.slice(1);
      return value !== '0' && value.startsWith('0');
    });
    const width = padded ? Math.max(...strings.map(value => value.length))
      : Math.max(String(Number(start)).length, String(Number(end)).length);
    // Stepped regex compilation pads and joins enumerated strings inside
    // fill-range, before our final output guard. Account for that materialized
    // text (including separators/group syntax) before invoking the dependency.
    const units = count * BigInt(width + (opts.toRegex ? 1 : 0))
      + (opts.toRegex ? 16n : 0n);
    if (units > BigInt(MAX_OUTPUT_UNITS)) {
      fail('ERR_BRACES_OUTPUT', 'Brace range materialized text exceeds output limit');
    }
  }
};

module.exports = { MAX_DEPTH, MAX_VISITS, MAX_OUTPUT_UNITS, depth, ast, arrays, parentStep, options, budget, output, range };
