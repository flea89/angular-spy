/**
 * @ngdoc module
 * @name spy.spies.spy
 */
const mod = angular.module('spy.spies.visible', []);

mod.directive('spyVisible', [
    '$window',
    '$parse',
    '$timeout',
    'clientRect',
    spyVisibleDirective
]);


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
        link(scope, elem, attrs, scrollContainerCtrl) {
            let rect = {},
                isHidden = false,
                scrollContainer,
                api = {
                    updateClientRect() {
                        const cRect = clientRect(scrollContainer, elem[0]);
                        isHidden = elem[0].offsetParent === null;
                        rect = cRect;
                    },
                    update(viewportRect) {
                        let isFullyVisible = (rect.top >= viewportRect.top && //Top border in viewport
                                (rect.top + rect.height) <= (viewportRect.top + viewportRect.height)) || //Bottom border in viewport
                            (rect.top <= viewportRect.top && rect.top + rect.height >= viewportRect.top + viewportRect.height), // Bigger than viewport

                            isFullyHidden = !isFullyVisible &&
                            rect.top > (viewportRect.top + viewportRect.height) || //Top border below viewport bottom
                            (rect.top + rect.height) < viewportRect.top; //Bottom border above viewport top

                        //Only change state when fully visible/hidden
                        if (isFullyVisible) {
                            api.setInView(true);
                        } else if (isFullyHidden) {
                            api.setInView(false);
                        }
                    },
                    getRect() {
                        return rect;
                    },
                    setInView(inView) {
                        if ($parse(attrs.spyVisible)(scope) !== inView && !isHidden) {
                            scope.$evalAsync(() => {
                                const spyVisibleSetter = $parse(attrs.spyVisible);
                                spyVisibleSetter.assign(scope, inView);
                            });
                        }
                    }
                };
            if (angular.isDefined(attrs.triggerUpdate)) {
                scope.$watch(attrs.triggerUpdate, function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $timeout(function() {
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

export default mod;
