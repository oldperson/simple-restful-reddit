/**
 * Create customied error body
 * @param {(Error|string)} error
 * @returns {object}
 */
function createErrorBody(error) {
  let message;
  if (!(error instanceof Error || typeof error === 'string')) {
    throw new TypeError('error should be a string or an instance of Error');
  }
  if (error instanceof Error) {
    ({ message } = error);
  }
  if (typeof error === 'string') {
    message = error;
  }
  return {
    message,
  };
}

module.exports.createErrorBody = createErrorBody;
