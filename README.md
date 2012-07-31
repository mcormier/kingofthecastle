King of the Castle 
====================

**King of the Castle** is an application for managing a
[single elimination tournament](http://en.wikipedia.org/wiki/Single-elimination_tournament)


My local tennis club has a weekly tournament on Saturday mornings called the [Wee Weekly](http://stgeorgetennis.ca/weeweekly.php). Players are assigned a ranking number and this changes from week to week depending on their standing in each tournament.  The process for managing this is by manually inputing people's names and previous rankings in an excel spreadsheet to calculate the next weeks rankings then manually changing the HTML code on the results page to reflect the latest results.  This can be a time consuming process.  The goal of **King of the Castle** is to make the process of determining the rankings quicker and easier and provide usable output that can be easily posted on the clubs website.

This is not a unique problem and an attempt will be made to make the application generic with extension points so that the application can be used for other sports tournaments.  The audience for such an application would be the many amateur sports clubs that hold such tournaments regularly.


The application uses the following technologies:

- [The Canvas Element](http://www.w3.org/TR/html5/the-canvas-element.html#the-canvas-element) - for displaying the tournament tree. HTML 5
- [JSON](http://www.json.org/) - for saving and loading tournament data
- [FileReader](http://www.w3.org/TR/FileAPI/#FileReader-interface) - for loading a saved tournament file.
- [Download attribute on A element](http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-download) - when downloading a tournament file.
- [ECMAScript 5](http://www.ecmascript.org/index.php) - Using enumerable with Object.defineProperty to specify what JSON should not serialize is cleaner code than writing custom JSON methods.


Making a self contained application with new HTML 5 features. 

Design Goals:
=============
- The admin interface will require a baseline web browser version.
- The client interface will use a dynamic HTML 5 interface using the canvas element if it can, otherwise a rendered image will be displayed to the client.
- Build plugin wrappers for major open source CMS (i.e. Joomla, concrete, Drupal)
- Plugin architecture for future support of different sports, types of tournaments.



Feature Support
===============
---

When using new browser features, it is important to consider how well they are supported.

Download Attribute Support
--------------------------

The download attribute was first supported in the development version of [Chrome (version 14)](http://codebits.glennjones.net/downloadattr/downloadattr.htm) in August 2011. Currently no other browser supports it.

Proposed here: http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#attr-hyperlink-download

Supposedly supported in Firefox -- https://developer.mozilla.org/en/HTML/element/a#attr-download
https://developer-new.mozilla.org/en-US/docs/HTML/Element/a

The download attribute is non-standard and not present in the current working draft of HTML5.

http://www.w3.org/TR/html5/the-a-element.html#the-a-element

If running on apache a .htaccess configuration could be used to force the download.
http://css-tricks.com/snippets/htaccess/force-files-to-download-not-open-in-browser/

__Conclusion__ : Although the new download attribute on &lt;a&gt; is very handy, there are many workarounds for other browsers.  The attribute degrades gracefully since it is ignored by other browsers.

Can be done with php on the servers side.  Workaround for other browsers, right click and choose save as.

ECMAScript 5 Support
--------------------

ECMAScript 5 is used to simplify the code by specifying what should or shouldn't be serialized when writing data to JSON.  Browser requirements for ECMA 5?

Canvas Support
--------------
- Safari 5.1.7 - Supported
- Chrome 20.x  - Supported
- Firefox 14 - Supported

