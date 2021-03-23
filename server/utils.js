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

module.exports = {
  htmlEscape
};
