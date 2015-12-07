import scrollSpyContainer from './scroll-container/scroll-container.directive';
import spies from './spies/spies.module';

const mod = angular.module('ngSpy', [
    scrollSpyContainer.name,
    spies.name
]);

//TODO: The current implementation works for scroll spies on the
// body element and for scroll divs when no parents are scrollable.
// The case where we have nested scroll elements has to be investigated.

export default mod;
