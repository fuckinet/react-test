function htmlEscape(string) {
  let escaped = string.toString().trim()
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/!{/g, '');
  const reUnescapedHtml = /[&<>"']/g;
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  if (string && reHasUnescapedHtml.test(string)) {
    escaped = escaped.replace(reUnescapedHtml, '');
  }
  return escaped;
}

/**
 * Error for throwing user input data form error's
 * @param error {object}
 * @param id {number}
 * @param error.message {string}
 * @constructor
 */
function PropertyError(error, id = -1) {
  Error.call(this, error);
  this.name = 'FormError';
  this.message = error;
  this.id = id;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, PropertyError);
  }
  else {
    this.stack = (new Error()).stack;
  }
}
PropertyError.prototype = Object.create(Error.prototype);

module.exports = {
  htmlEscape,
  PropertyError
};
