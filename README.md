promising-debounce
==================

`debounce` takes a function that optionally returns a promise, and debounces it, returning a
promise to all callers.  When the debounced function fulfills its promise or returns a
non-promise, all callers get the result.

Example usage: http://jsfiddle.net/cwarden/tz2CK/
