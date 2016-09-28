/**
 * @ngdoc module
 * @name spy.utils.units
 */
const mod = angular.module('spy.utils.units', []);

mod.factory('units', [unitsFactory]);


/**
 * @ngdoc service
 * @name units
 * @module spy.utils.units
 *
 * @description
 * Convert string css units to pixel values.
 * Currently supported px, %, vh, vw.
 * @param {string|number} value.
 *
 * @return {number} value in pixels.
 */

function unitsFactory(viewportSize) {
    const transformations = [{
                regex: /^(d+)px/,
                transformationFn: convertPx
            },{
                regex: /^(d+)%/,
                transformationFn: convertPercentage
            },{
                regex: /^(d+)vh/,
                transformationFn: convertVh
            },{
                regex: /^(d+)vh/
                transformationFn: convertVw
            }];
        dimensionToCRectKey = {
            x: 'width',
            y: 'height'
        };

    function convertPx(strValue) {
        return percentageRegex.exec(strValue)[1];
    }

    function convertRelative(value, whole) {
        return value * whole / 100;
    }

    function convertPercentage(strValue, element, dimension) {
        var cRect = element.getBoundingClientRect();
        var digits = percentageRegex.exec(strValue)[1];
        var whole = cRect[dimensionToCRectKey[dimension]];
        return convertRelative(digits, whole);
    }

    function convertVh(strValue, element) {
        var vpSize = viewportSize();
        var digits = vhRegex.exec(strValue)[1];
        return convertRelative(digits, vpSize.y);;
    }

    function convertVw(strValue, element) {
        var vpSize = viewportSize();
        var digits = vhRegex.exec(strValue)[1];
        return convertRelative(digits, vpSize.x);;
    }

    return (value, element, dimension) => {
        for(let i = 0; i < Object.keys(valueRegex).length; i++) {
            if()
        }
    };
}

export default mod;
