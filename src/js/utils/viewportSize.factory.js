/**
 * @ngdoc module
 * @name spy.utils.viewportSize
 */
const mod = angular.module('spy.utils.viewportSize', []);

mod.factory('spyDebounce', ['$timeout', '$q', viewportSizeFactory]);


/**
* @ngdoc service
* @name viewportSize
* @module spy.utils.viewportSize
*
* @description
* Return the viewport size.
*
* @return {object}      The viewport size.
*/
function viewportSizeFactory($timeout, $q) {
    return () => {
        var x, y;
        x = 0;
        y = 0;
        if (window.innerHeight) {
          x = window.innerWidth;
          y = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
        } else if (document.body) {
          x = document.body.clientWidth;
          y = document.body.clientHeight;
        }
        return {
          width: x,
          height: y
        };
    };
}

export default mod;
