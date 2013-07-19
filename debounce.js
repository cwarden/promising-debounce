/* Takes a function that optionally returns a promise, and debounces it, returning a
 * promise to all callers.  When the debounced function fulfills its promise or
 * returns a non-promise, all callers get the result.
 * Example: http://bit.ly/1btZC4f
 */
var debounce = function(func, wait, immediate) {
	var timeout;
	var deferred = $.Deferred();
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) {
				$.when(func.apply(context, args))
					.then(deferred.resolve, deferred.reject, deferred.notify);
				deferred = $.Deferred();
			}
		};
		var callNow = immediate && !timeout;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
		if (callNow) {
			$.when(func.apply(context, args))
				.then(deferred.resolve, deferred.reject, deferred.notify);
			deferred = $.Deferred();
		}
		return deferred.promise();
	};
};
