/* eslint-disable no-console */

/**
 * Calticulate score of controversy, the higher the score is, the more controversial the post is.
 * Orgin from https://github.com/reddit-archive/reddit/blob/master/r2/r2/lib/db/_sorts.pyx
 * @param {*} ups
 * @param {*} downs
 * @returns {Number} score
 */
function controversy(ups, downs) {
  if (downs <= 0 || ups <= 0) {
    return 0;
  }

  const magnitude = ups + downs;
  const balance = ups > downs ? (downs / ups) : (ups / downs);

  return magnitude ** balance;
}

// z represents the statistical confidence
// z = 1.0 => ~69%, 1.96 => ~95% (default)
const z = 1.96;

/**
 * Calticulate score of top, the higher the score is, the topper the post is.
 * This is the Wilson score interval sort.
 * http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
 * \n https://github.com/clux/decay/blob/master/decay.js
 * @param {*} ups
 * @param {*} downs
 * @returns {Number} score
 */
function top(ups, downs) {
  const n = ups + downs;
  if (n === 0) {
    return 0;
  }

  const p = ups / n;
  const sqrtexpr = (p * (1 - p) + z * z / (4 * n)) / n;
  return (p + z * z / (2 * n) - z * Math.sqrt(sqrtexpr)) / (1 + z * z / n);
}

/**
 * @private
 * @param {*} date
 */
function epochSeconds(date) {
  return date.getTime() / 1000;
}

/**
 * @private
 * @param {*} ups
 * @param {*} downs
 */
function score(ups, downs) {
  return ups - downs;
}


const unixInitailTimestamp = 1134028003;

// 12.5 hours ago would be less hot
const decaySeconds = 12.5 * 60 * 60;

/**
 * Calticulate score of hot, the higher the score is, the hotter the post is.
 * https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
 * @param {*} ups
 * @param {*} downs
 * @param {*} date
 */
function hot(ups, downs, date) {
  const s = score(ups, downs);
  const order = Math.log10(Math.max(Math.abs(s), 1));
  const sign = Math.sign(s);
  const normalizedSeconds = epochSeconds(date) - unixInitailTimestamp;
  return Math.fround(sign * order + normalizedSeconds / decaySeconds);
}

module.exports = {
  controversy,
  top,
  hot,
};
