import scrollSpyContainer from './scroll-container/scroll-container.directive';
import spies from './spies/spies.module';
import clientRect from './utils/client-rect.service';

 /**
  * @ngdoc module
  * @name spy
  */
const mod = angular.module('spy', [
    scrollSpyContainer.name,
    spies.name,
    clientRect.name
]);

//TODO: The current implementation works for scroll spies on the
// body element and for scroll divs when no parents are scrollable.
// The case where we have nested scroll elements has to be investigated.

export default mod;
