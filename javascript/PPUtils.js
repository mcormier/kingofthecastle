"use strict";

function $(id){ return document.getElementById(id); }

function showElement( e ) { e.style.visibility = "visible"; }
function hideElement( e ) { e.style.visibility = "hidden"; }

function PPUtils() {}

PPUtils.log = function ( output ) {
    if (window.console ) {
      console.log(output);
    }
}

PPUtils.objectImplementsMethod = function ( obj, method ) {

  if (obj == null || !obj[method] || typeof obj[method] !== 'function') {
    return false;
  }

  return true;
}

// References:
//   http://krasimirtsonev.com/blog/article/object-oriented-programming-oop-in-javascript-extending-Inheritance-classes
//   http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
PPUtils.extend = function (ChildClass, ParentClass) {
    var parent = new ParentClass();
    ChildClass.prototype = parent;
    ChildClass.prototype.super = parent.constructor;
    ChildClass.prototype.constructor = ChildClass;
}


// Returns the callback so that it can be removed later
PPUtils.bindTextField = function(event, id, boundObj, objCallback) {

  var callback = function receive(evt) {
    boundObj[objCallback](id, evt);
  }

  $(id).addEventListener(event, callback, false);

  return callback;
}
PPUtils.bind = function(event, id, callback) {

  $(id).addEventListener(event, callback, false);

}