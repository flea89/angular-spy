/**
 * @ngdoc module
 * @name spy.utils.debounce
 */
const mod = angular.module('spy.utils.debounce', []);

mod.factory('spyDebounce', ['$timeout', '$q', debounceFactory]);


/**
* @ngdoc service
* @name debounce
* @module spy.utils.debounce
*
* @description
* Simple debounce function.
*
* @param  {function} func       The function to debounce.
* @param  {number} wait         The delay expressed in ms.
* @param  {boolean} immediate   Trigger the function on the
*                               leading edge, instead of the trailing.
* @return {function}            debounced function
*/
function debounceFactory($timeout, $q) {
    return (func, wait, immediate) => {
        let timeout,
            deferred = $q.defer();

        return (...args) => {
            const context = this,
                later = () => {
                    timeout = null;
                    if (!immediate) {
                        deferred.resolve(func.apply(context, args));
                        deferred = $q.defer();
                    }
                },
                callNow = immediate && !timeout;
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
}

export default mod;
