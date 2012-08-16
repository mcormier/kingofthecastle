//
// All parameters are required.
// The delegate must implement the process method.
//
function PPFileManager(delegate, textInputId, saveLinkId) {
    if (delegate == null || textInputId == null || saveLinkId == null) {
      throw new Error("PPFileManager missing required parameter.");
    }

  if ( ! PPUtils.objectImplementsMethod( delegate, "process") ) {
     throw new Error("Process function is not implemented by delegate.");
  }

  this.delegate = delegate;
  this.textInputId = textInputId;
  this.saveLinkId = saveLinkId;


   var self = this;
   // Bind to html elements when document is loaded.
   PPUtils.bind("load", window, function () {self.bind();} );
}

PPFileManager.prototype.bind = function () {
  var self = this;
  PPUtils.bind("click", $(this.saveLinkId), function () {self.createFile();} );
}

PPFileManager.prototype.createFile = function () {
  var a = $(this.saveLinkId);
  var filename = $(this.textInputId).value;

  // Escape encodes % but does not encode * @ etc
  // TODO test with those characters...
  // TODO -- relies on global variable. get from delegate.
  var data = escape(JSON.stringify(theApp.tournament));

  a.href = "data:application/json;charset=utf-8," + data;
  a.download = filename;
}


PPFileManager.errorHandler = function (evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        PPUtils.log('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        PPUtils.log('File is not readable');
        break;
      case evt.target.error.SECURITY_ERR:
        // This will occur when loading a file and using a file:// URL.
        // Run a local http server when testing load functionality.
        //
        // python -m SimpleHTTPServer
        //
        // or run chrome with --allow-file-access-from-files
        //
        // Reference: http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18
        PPUtils.log('A Security Error occurred');

        break;
      case evt.target.error.ABORT_ERR:
        break; // no op
      default:
        PPUtils.log('An error occurred reading this file. Error code = ' + evt.target.error.code);
    };
  }

PPFileManager.load = function(e) { console.log("HERE"); }

PPFileManager.prototype.handleFileSelect = function (evt) {
  var files = evt.target.files; // FileList object
  var delegate = this.delegate;
  var f = files[0];
  var reader = new FileReader();

  reader.onerror = PPFileManager.errorHandler;
  reader.onprogress = function(e) { };
  reader.onabort = function(e) { PPUtils.log('File read cancelled'); };
  reader.onload = function(e) {   delegate.process(e.target.result); };

  reader.readAsText(f);
}

