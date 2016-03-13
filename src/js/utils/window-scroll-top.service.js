/**
 * @ngdoc module
 * @name spy.utils.windowScrollTop
 */
const mod = angular.module('spy.utils.windowScrollTop', []);


mod.factory('windowScrollTop', ['$window', windowScrollTopFactory]);


/**
* @ngdoc service
* @name windowScrollTop
* @module spy.utils.debounce
*
* @description
*
* Different browsers scroll the page using different elements. For example,
* Firefox scrolls on document.documentElement (<html>),
* while Safari scrolls on document.body.
* The scrollTop property is therefore inconsistent, let's just use one or the other
 * @return {number}
 */
function windowScrollTopFactory($window) {
    return () => {
        return $window.document.documentElement.scrollTop ||
            $window.document.body.scrollTop;
    };
}

export default mod;
