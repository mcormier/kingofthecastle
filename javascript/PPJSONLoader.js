function PPJSONLoader() {}


// Generates escaped JSON for use in embedding data
// in a link.  <a href="data:application/json;charset=utf-8,[data]"
// For more info on Data URI's see: http://en.wikipedia.org/wiki/Data_URI_scheme
PPJSONLoader.prototype.getURIData = function(theObj) {
  // Use escape to convert special characters like [space] to %20
  // so there will be no data loss when using a Data URI to
  // save data.
  return escape(JSON.stringify(theObj));
}

PPJSONLoader.prototype.loadData = function(data) {
  return JSON.parse(unescape(data));
}
