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

PPUtils.objectImplementsMethods = function ( obj, methodArray ) {
  for (var i = 0; i < methodArray.length; i++) {
    if ( PPUtils.objectImplementsMethod(obj, methodArray[i]) == false) {
      return false;
    }
  }
  return true;
}

PPUtils.setElementAttributes = function ( element, attributeArray, valuesArray) {
   for( var i = 0; i < attributeArray.length; i ++ ) {
     element.setAttribute( attributeArray[i], valuesArray[i]);
   }
}

// References:
//   http://krasimirtsonev.com/blog/article/object-oriented-programming-oop-in-javascript-extending-Inheritance-classes
//   http://peter.michaux.ca/articles/class-based-inheritance-in-javascript
PPUtils.extend = function (ChildClass, ParentClass) {
    var parent = new ParentClass();
    ChildClass.prototype = parent;
    ChildClass.prototype.superclass = parent.constructor;
    ChildClass.prototype.constructor = ChildClass;
    ChildClass.superclass =  ParentClass;
    ChildClass.superproto = ParentClass.prototype;
}


// Returns the callback so that it can be removed later
PPUtils.bindTextField = function(event, element, boundObj, objCallback) {

  var callback = function receive(evt) {
    boundObj[objCallback](element, evt);
  }

  if ( typeof element.addEventListener != "undefined" ) {
    element.addEventListener(event, callback, false);
  } else if ( typeof element.attachEvent != "undefined" ) { // Supports IE < 9
    element.attachEvent(event, callback);
  }

  return callback;
}
PPUtils.bind = function(event, element, callback) {
  if ( typeof element.addEventListener != "undefined" ) {
    element.addEventListener(event, callback, false);
  } else if ( typeof element.attachEvent != "undefined" ) { // Supports IE < 9
    element.attachEvent(event, callback);
  }
}

PPUtils.isPowerOf2 = function(x) {
  return x == 1 || x == 2 || x == 4 || x == 8 || x == 16 || x == 32 ||
     x == 64 || x == 128 || x == 256 || x == 512 || x == 1024 ||
                x == 2048 || x == 4096 || x == 8192 || x == 16384 ||
                x == 32768 || x == 65536 || x == 131072 || x == 262144 ||
                x == 524288 || x == 1048576 || x == 2097152 ||
                x == 4194304 || x == 8388608 || x == 16777216 ||
                x == 33554432 || x == 67108864 || x == 134217728 ||
                x == 268435456 || x == 536870912 || x == 1073741824 ||
                x == 2147483648;
}

PPUtils.notifyListeners = function (listenersArray, listenerMethod,value ) {
  for (var i = 0 ; i < listenersArray.length; i++) {
    var obj = listenersArrays[i];
    obj[listenerMethod](value);
  }
}
