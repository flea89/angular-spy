import scrollSpy from '../../src/js/scroll-container/scroll-container.directive';

describe('ngSpyContainer', () => {
    let compile,
        rootScope,
        scope,
        window,
        timeout,
        element,
        controller,
        template = `
            <div spy-scroll-container>
        `;

    beforeEach(angular.mock.module('spy.scrollSpy.scrollContainer'));
    beforeEach(angular.mock.inject(($compile, $rootScope, $timeout, $window) => {
        compile = $compile;
        window = $window;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        timeout = $timeout;
        element = compile(template)(scope);
        controller = element.controller('spyScrollContainer');
    }));

    it('should be defined', () => {
        scrollSpy.should.be.defined;
    });

    it('should be an angular module', () => {
        scrollSpy.name.should.equal('spy.scrollSpy.scrollContainer');
    });

    describe('controller', () => {
        it('should be defined', () => {
            controller.should.be.defined;
        });

        describe('registerSpy', () => {
            it('should be defined', () => {
                controller.registerSpy.should.be.a('function');
            });

            it('should register a spy', () => {
                let spy = {
                    getRect: sinon.spy(() => {
                        return {
                            top: 500,
                            height: 500
                        };
                    }),
                    setInView: sinon.spy()
                };
                controller.registerSpy(spy);
                controller.spies.length.should.be.equal(1);
            });
        });

        describe('getScrollContainer', () => {
            it('should be defined', () => {
                controller.getScrollContainer.should.be.a('function');
            });

            it('should return the scrollContainer DOM node', () => {
                let node = controller.getScrollContainer();
                node.should.be.equal(element[0]);
            });
        });
    });
});
