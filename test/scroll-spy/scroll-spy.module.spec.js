import spy from '../../src/js/spy';

describe('spy', () => {
    it('should be defined', () => {
        spy.should.be.defined;
    });

    it('should be an angular module', () => {
        spy.name.should.equal('spy');
    });
});
