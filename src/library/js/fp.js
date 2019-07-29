import { isFunction } from './utils.js';

export const eq = value1 => value2 => value1 === value2;

export const prop = key => source => source
  ? source[key]
  : undefined;

export const propEq = (key, value) => {
  const getProp = prop(key);
  const isEqual = eq(value);

  return source => isEqual(getProp(source));
};

export const negate = predicate => {
  if (!isFunction(predicate)) {
    throw TypeError('First argument must be a function');
  }

  return (...args) => !predicate(...args);
};
