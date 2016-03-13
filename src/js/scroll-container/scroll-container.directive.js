import debounce from '../utils/debounce.service';
import windowScrollTop from '../utils/window-scroll-top.service';

/**
 * @ngdoc module
 * @name ngSpy.scrollContainer
 */
const mod = angular.module('spy.scrollContainer', [
    debounce.name,
    windowScrollTop.name
]);

mod.directive('spyScrollContainer', ['$window', '$timeout', 'spyDebounce', 'windowScrollTop',spyScrollContainerDirective ]);


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
            this.spies = [];
            this.registerSpy = (spy) => {
                this.spies.push(spy);
            };

            this.getScrollContainer = () => {
                return $element[0];
            };
        }],
        link (scope, elem, attrs, selfCtrl) {
            const afTimeout = 400;
            let vpHeight,
                $aWindow = angular.element($window),
                $scroller = elem[0].tagName === 'BODY' ?
                    $aWindow : elem,
                animationFrame,
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
                selfCtrl.spies.forEach((spy)=> {
                    spy.updateClientRect();
                });
                onScroll();
            }

            function onAnimationFrame() {
                const viewportRect = getViewportRect(),
                        timestamp = $window.performance.now(),
                        delta = timestamp - scrollPrevTimestamp,
                        scrollDelta = viewportRect.top - previousScrollTop,
                        scrollDirection = scrollDelta === 0 ? 0 :
                            scrollDelta / Math.abs(scrollDelta);

                selfCtrl.spies.forEach((spy)=> {
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
                const currentScroll = windowScrollTop();
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

export default mod;
