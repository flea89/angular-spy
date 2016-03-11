const mod = angular.module('spy.utils.clientRect', []);

mod.factory('clientRect', [() => {
    return (scrollContainer, element) => {
        const isHidden = element.offsetParent === null;
        let clientRect = element.getBoundingClientRect();
        let rect = {};
        if (!isHidden) {
            rect.top = clientRect.top + scrollContainer.scrollTop;
            rect.left = clientRect.left + scrollContainer.scrollLeft;
            rect.width = clientRect.width;
            rect.height = clientRect.height;
        }

        return {
            rect: rect,
            isHidden: isHidden
        };
    };
}]);

export default mod;
