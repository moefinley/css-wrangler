import * as chai from 'chai';
import {DiffElement} from "../../../crawler/app/diffElement";
const expect = chai.expect;

suite('DiffElement object', ()=> {
    test('should create a DiffElement when all required value are passed', () => {
        let testDiffElement = new DiffElement('selector');

        expect(testDiffElement.original).to.exist;
        expect(testDiffElement.comparand).to.exist;
        expect(testDiffElement.diff).to.exist;
        expect(testDiffElement.selector).to.exist;

        expect(testDiffElement.original).to.be.an('object');
        expect(testDiffElement.comparand).to.be.an('object');
        expect(testDiffElement.diff).to.be.an('array');
        expect(testDiffElement.selector).to.be.a('string');
    });
});