// http://en.wikipedia.org/wiki/XMLHttpRequest

if (typeof XMLHttpRequest == "undefined") {
  XMLHttpRequest = function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch (e) {}
    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  };

  XMLHttpRequest.DONE = 4;
}


function PPAjaxRequest(successCallback, errorCallback) {
  if (errorCallback == null || successCallback == null) {
    throw new Error("PPAjaxRequest missing required parameter.");
  }
  this.xmlHttp = new XMLHttpRequest();

  var xmlHttp = this.xmlHttp;
  this.xmlHttp.onreadystatechange =
    function () {
       if( xmlHttp.readyState == XMLHttpRequest.DONE ) {
          if( xmlHttp.status == 200) {
            successCallback(xmlHttp);
        } else {
            errorCallback(xmlHttp);
        }
      }
    }

  }

PPAjaxRequest.prototype.getResource = function(resourceName) {
    this.xmlHttp.open("GET",resourceName, true);
    this.xmlHttp.send(null);
}

PPAjaxRequest.prototype.getResourceOnLoad = function(resourceName) {
   var self = this;
   PPUtils.bind("load", window, function () {self.getResource(resourceName);} );
}
