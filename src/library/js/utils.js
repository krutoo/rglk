const functionTags = Object.freeze([
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
  'Proxy',
]);

export function isFunction (value) {
  return functionTags.includes(getTag(value));
}

export function isFiniteNumber (value) {
  return isNumber(value) && isFinite(value);
}

export function isNumber (value) {
  return typeof value === 'number' || getTag(value) === 'Number';
}

export function isObject (value) {
  return value === Object(value);
}

export function getTag (value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
