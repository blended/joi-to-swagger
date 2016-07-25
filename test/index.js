import { expect } from 'chai';

import joiToSwagger from '../src';

describe('joi-to-swagger', () => {
    it('should exist and export an object', () => {
        expect(joiToSwagger).to.exist.and.be.an('object');
    });

    it('should export getParameterObject', () => {
        expect(joiToSwagger.getParameterObject).to.exist.and.be.a('function');
    });
});
