(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsDebounceService = require('../utils/debounce.service');

var _utilsDebounceService2 = _interopRequireDefault(_utilsDebounceService);

var _utilsWindowScrollTopService = require('../utils/window-scroll-top.service');

var _utilsWindowScrollTopService2 = _interopRequireDefault(_utilsWindowScrollTopService);

/**
 * @ngdoc module
 * @name spy.scrollContainer
 */
var mod = angular.module('spy.scrollContainer', [_utilsDebounceService2['default'].name, _utilsWindowScrollTopService2['default'].name]);

mod.directive('spyScrollContainer', ['$window', '$timeout', 'spyDebounce', 'windowScrollTop', spyScrollContainerDirective]);

/**
* @ngdoc directive
* @module spy.scrollContainer
* @name spyScrollContainer
*
* @restrict A
*
*
* @description
* The spyScrollContainer indicates which is the main scroller in the page.
*
*/
function spyScrollContainerDirective($window, $timeout, spyDebounce, windowScrollTop) {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', function ($scope, $element) {
            var _this = this;

            this.spies = [];
            this.registerSpy = function (spy) {
                _this.spies.push(spy);
            };

            this.getScrollContainer = function () {
                return $element[0];
            };
        }],
        link: function link(scope, elem, attrs, selfCtrl) {
            var afTimeout = 400;
            var vpHeight = undefined,
                $aWindow = angular.element($window),
                $scroller = elem[0].tagName === 'BODY' ? $aWindow : elem,
                animationFrame = undefined,
                lastScrollTimestamp = 0,
                scrollPrevTimestamp = 0,
                previousScrollTop = 0;

            function onScroll() {
                lastScrollTimestamp = $window.performance.now();
                if (!animationFrame) {
                    animationFrame = $window.requestAnimationFrame(onAnimationFrame);
                }
                scrollPrevTimestamp = $window.performance.now();
            }

            function onResize() {
                vpHeight = Math.max($window.document.documentElement.clientHeight, window.innerHeight || 0);
                selfCtrl.spies.forEach(function (spy) {
                    spy.updateClientRect();
                });
                onScroll();
            }

            function onAnimationFrame() {
                var viewportRect = getViewportRect(),
                    timestamp = $window.performance.now(),
                    delta = timestamp - scrollPrevTimestamp,
                    scrollDelta = viewportRect.top - previousScrollTop,
                    scrollDirection = scrollDelta === 0 ? 0 : scrollDelta / Math.abs(scrollDelta);

                selfCtrl.spies.forEach(function (spy) {
                    spy.update(viewportRect, scrollDirection);
                });

                previousScrollTop = viewportRect.top;

                if (delta < afTimeout) {
                    queueAf();
                } else {
                    cancelAf();
                }
            }

            function getViewportRect() {
                var currentScroll = windowScrollTop();
                return {
                    top: currentScroll,
                    height: vpHeight
                };
            }

            function queueAf() {
                animationFrame = $window.requestAnimationFrame(onAnimationFrame);
            }

            function cancelAf() {
                $window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            scope.$on('spyScrollContainer:updateSpies', onResize);

            if (angular.isDefined(attrs.triggerUpdate)) {
                scope.$watch(attrs.triggerUpdate, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $timeout(function () {
                            onResize();
                        }, 0);
                    }
                });
            }

            $aWindow.on('resize', spyDebounce(onResize, 300));
            $scroller.on('scroll', onScroll);
            $timeout(onResize);
        }
    };
}

exports['default'] = mod;
module.exports = exports['default'];

},{"../utils/debounce.service":6,"../utils/window-scroll-top.service":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _visibleDirectiveJs = require('./visible.directive.js');

var _visibleDirectiveJs2 = _interopRequireDefault(_visibleDirectiveJs);

/**
 * @ngdoc module
 * @name spy.spies
 */
var mod = angular.module('spy.spies', [_visibleDirectiveJs2['default'].name]);

exports['default'] = mod;
module.exports = exports['default'];

},{"./visible.directive.js":3}],3:[function(require,module,exports){
/**
 * @ngdoc module
 * @name spy.spies.spy
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var mod = angular.module('spy.spies.visible', []);

mod.directive('spyVisible', ['$window', '$parse', '$timeout', 'clientRect', spyVisibleDirective]);

/**
* @ngdoc directive
* @module spy.spies.visible
* @name spyVisible
*
* @restrict A
*
*
* @description
* Spies whenere a dom element becomes fully visible. The binding is set back
* to false when is becomes fully hidden.
*
* spyVisible requires the spyScrollContainer to be place on the leading parent
* scroll container.
*
*
*/
function spyVisibleDirective($window, $parse, $timeout, clientRect) {
    return {
        restrict: 'A',
        require: '^^spyScrollContainer',
        link: function link(scope, elem, attrs, scrollContainerCtrl) {
            var rect = {},
                isHidden = false,
                scrollContainer = undefined,
                api = {
                updateClientRect: function updateClientRect() {
                    var cRect = clientRect(scrollContainer, elem[0]);
                    isHidden = elem[0].offsetParent === null;
                    rect = cRect;
                },
                update: function update(viewportRect) {
                    var isFullyVisible = rect.top >= viewportRect.top && //Top border in viewport
                    rect.top + rect.height <= viewportRect.top + viewportRect.height || //Bottom border in viewport
                    rect.top <= viewportRect.top && rect.top + rect.height >= viewportRect.top + viewportRect.height,
                        // Bigger than viewport

                    isFullyHidden = !isFullyVisible && rect.top > viewportRect.top + viewportRect.height || //Top border below viewport bottom
                    rect.top + rect.height < viewportRect.top; //Bottom border above viewport top

                    //Only change state when fully visible/hidden
                    if (isFullyVisible) {
                        api.setInView(true);
                    } else if (isFullyHidden) {
                        api.setInView(false);
                    }
                },
                getRect: function getRect() {
                    return rect;
                },
                setInView: function setInView(inView) {
                    if ($parse(attrs.spyVisible)(scope) !== inView && !isHidden) {
                        scope.$evalAsync(function () {
                            var spyVisibleSetter = $parse(attrs.spyVisible);
                            spyVisibleSetter.assign(scope, inView);
                        });
                    }
                }
            };
            if (angular.isDefined(attrs.triggerUpdate)) {
                scope.$watch(attrs.triggerUpdate, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $timeout(function () {
                            api.updateClientRect();
                            api.update();
                        }, 0);
                    }
                });
            }

            scrollContainer = scrollContainerCtrl.getScrollContainer();
            scrollContainerCtrl.registerSpy(api);
            api.updateClientRect();
        }
    };
}

exports['default'] = mod;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _scrollContainerScrollContainerDirective = require('./scroll-container/scroll-container.directive');

var _scrollContainerScrollContainerDirective2 = _interopRequireDefault(_scrollContainerScrollContainerDirective);

var _spiesSpiesModule = require('./spies/spies.module');

var _spiesSpiesModule2 = _interopRequireDefault(_spiesSpiesModule);

var _utilsClientRectService = require('./utils/client-rect.service');

var _utilsClientRectService2 = _interopRequireDefault(_utilsClientRectService);

/**
 * @ngdoc module
 * @name spy
 */
var mod = angular.module('spy', [_scrollContainerScrollContainerDirective2['default'].name, _spiesSpiesModule2['default'].name, _utilsClientRectService2['default'].name]);

//TODO: The current implementation works for scroll spies on the
// body element and for scroll divs when no parents are scrollable.
// The case where we have nested scroll elements has to be investigated.

exports['default'] = mod;
module.exports = exports['default'];

},{"./scroll-container/scroll-container.directive":1,"./spies/spies.module":2,"./utils/client-rect.service":5}],5:[function(require,module,exports){
/**
 * @ngdoc module
 * @name spy.utils.clientRect
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mod = angular.module('spy.utils.clientRect', []);

/**
 * @typedef elementRect
 * @type Object
 * @property {number} top The X Coordinate
 * @property {number} left The Y Coordinate
 * @property {number} width The element width
 * @property {number} height The elent height.
 */

mod.factory('clientRect', [clientRectFactory]);

/**
 * @ngdoc service
 * @name clientRect
 * @module spy.utils.clientRect
 *
 * @description
 * `$mdSidenav` is a utility to calculate the element position and size,
 * taking in account the parent scroller container. It checks if the element is in the dom
 * or not.
 *
 * @param  {DOMElement} scrollContainer The root scroll container.
 * @param  {DOMElement} element         Target element.
 * @return {elementRect} elementRect
 */

function clientRectFactory() {
  return function (scrollContainer, element) {
    var clientRect = element.getBoundingClientRect();
    var rect = {};

    rect.top = clientRect.top + scrollContainer.scrollTop;
    rect.left = clientRect.left + scrollContainer.scrollLeft;
    rect.width = clientRect.width;
    rect.height = clientRect.height;

    return rect;
  };
}

exports['default'] = mod;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
/**
 * @ngdoc module
 * @name spy.utils.debounce
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var mod = angular.module('spy.utils.debounce', []);

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
    var _this = this;

    return function (func, wait, immediate) {
        var timeout = undefined,
            deferred = $q.defer();

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var context = _this,
                later = function later() {
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

exports['default'] = mod;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
/**
 * @ngdoc module
 * @name spy.utils.windowScrollTop
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var mod = angular.module('spy.utils.windowScrollTop', []);

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
  return function () {
    return $window.document.documentElement.scrollTop || $window.document.body.scrollTop;
  };
}

exports['default'] = mod;
module.exports = exports['default'];

},{}]},{},[4])
//# sourceMappingURL=spy.js.map
