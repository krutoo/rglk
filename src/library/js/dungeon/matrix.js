import { isFunction } from '../utils.js';

/**
 * @typedef {Object} MatrixType Matrix.
 * @property {function(Function)} forEach Will call callback for each item.
 * @property {function(number, number): *} get Item getter.
 * @property {function(number, number, *)} set Item setter.
 */

/**
 * Returns new matrix.
 * @param {number} [width=1] Matrix width.
 * @param {number} [height=1] Matrix width.
 * @param {*} filler Value that items will contains by default.
 * @return {MatrixType} Matrix.
 */
export const createMatrix = (width = 1, height = 1, filler = 0) => {
  const size = Number(width) * Number(height);
  const items = Array(size).fill(filler); // keeps items in one dimensional list

  const matrix = {
    width,
    height,
    get: (x, y) => items[pointToIndex(x, y, width)],
    set: (x, y, item) => items[pointToIndex(x, y, width)] = item,
    forEach: callback => matrix.forEachInRect(0, 0, width, height, callback),
    forEachInRect: (rectLeft, rectTop, rectWidth, rectHeight, callback) => {
      if (isFunction(callback)) {
        for (let x = rectLeft; x < rectLeft + rectWidth; x++) {
          for (let y = rectTop; y < rectTop + rectHeight; y++) {
            callback(x, y, matrix.get(x, y));
          }
        }
      }
    },
  };

  return matrix;
};

/**
 * Transforms coordinates in matrix to index in linear matrix view.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @param {number} width Width of matrix.
 * @return {number} Index of item in linear matrix view.
 */
export const pointToIndex = (x, y, width) => x + (y * width);
