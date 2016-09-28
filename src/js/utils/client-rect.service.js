/**
 * @ngdoc module
 * @name spy.utils.clientRect
 */
const mod = angular.module('spy.utils.clientRect', []);

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
    return (scrollContainer, element, offset) => {
        let clientRect = element.getBoundingClientRect();
        let rect = {};
        let defaultOffset = {
            top: 0,
            left: 0
        };

        offset = angular.extend(defaultOffset, offset);

        rect.top = clientRect.top + scrollContainer.scrollTop + offset.top;
        rect.left = clientRect.left + scrollContainer.scrollLeft + offset.left;
        rect.width = clientRect.width;
        rect.height = clientRect.height;

        return rect;
    };
}

export default mod;
