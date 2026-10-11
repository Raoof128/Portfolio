'use strict';

const fill = require('fill-range');
const stringify = require('./stringify');
const utils = require('./utils');
const guards = require('./guards');

const append = (queue = '', stash = '', enclose = false, depth = 0) => {
  guards.depth(depth);
  if (depth === 0) guards.arrays(queue, stash);
  const result = [];
  const budget = guards.budget();
  const push = value => {
    guards.output(value, budget);
    result.push(value);
  };

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return guards.output(queue);
  if (!queue.length) {
    if (enclose) {
      for (const ele of utils.flatten(stash)) push(`{${ele}}`);
      return result;
    }
    return guards.output(stash);
  }

  for (const item of queue) {
    if (Array.isArray(item)) {
      for (const value of item) {
        push(append(value, stash, enclose, depth + 1));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        push(Array.isArray(ele) ? append(item, ele, enclose, depth + 1) : item + ele);
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  guards.options(options);
  guards.ast(ast);
  const rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;

  const walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;
    const parents = new Set();
    let parentDepth = 0;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      guards.parentStep(p, parents, ++parentDepth);
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      const args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      guards.range(args, options);
      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    const enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;
    const blocks = new Set();
    let blockDepth = 0;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      guards.parentStep(block, blocks, ++blockDepth);
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return guards.output(utils.flatten(walk(ast)));
};

module.exports = expand;
