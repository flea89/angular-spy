const mod = angular.module('spy.utils.windowScrollTop', []);

mod.factory('windowScrollTop', ['$window', ($window) => {
    return () => {
        return $window.document.documentElement.scrollTop ||
            $window.document.body.scrollTop;
    };
}]);

export default mod;
