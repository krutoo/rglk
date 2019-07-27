export function isFunction (value) {
  return value && typeof value === 'function';
}

export function isFiniteNumber (value) {
  return isNumber(value) && isFinite(value);
}

export function isNumber (value) {
  return typeof value === 'number' || getTag(value) === 'Number';
}

export function getTag (value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
