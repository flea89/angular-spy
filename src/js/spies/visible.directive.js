const mod = angular.module('spy.scrollSpy.visible', []);

mod.directive('spyVisible', ['$window', '$parse', '$timeout', ($window, $parse, $timeout) => {
    return {
        restrict: 'A',
        require: '^^spyScrollContainer',
        link (scope, elem, attrs, ctrl) {
            let rect = {},
                hidden = false,
                scrollContainer,
                api = {
                    updateClientRect () {
                        let clientRect = elem[0].getBoundingClientRect();
                        rect.top = clientRect.top + scrollContainer.scrollTop;
                        rect.left = clientRect.left + scrollContainer.scrollLeft;
                        rect.width = clientRect.width;
                        rect.height = clientRect.height;
                        hidden = elem[0].offsetParent === null;
                    },
                    update (viewportRect) {
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
                    getRect () {
                        return rect;
                    },
                    setInView (inView) {
                        if ($parse(attrs.spyVisible)(scope) !== inView && !hidden) {
                            scope.$evalAsync(() => {
                                const spyVisibleSetter = $parse(attrs.spyVisible);
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

            scrollContainer = ctrl.getScrollContainer() || $window.document.body;
            ctrl.registerSpy(api);
            api.updateClientRect();
        }
    };
}]);

export default mod;
