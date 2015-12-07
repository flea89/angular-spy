import ngSpy from '../../src/js/spy';

describe('ngSpy', () => {
    it('should be defined', () => {
        ngSpy.should.be.defined;
    });

    it('should be an angular module', () => {
        ngSpy.name.should.equal('ngSpy');
    });
});
