"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const page_1 = require("../../../crawler/app/data/page");
const expect = chai.expect;
suite('Page object', () => {
    test('should create a Page when all required value are passed', () => {
        let testPage = new page_1.Page('uniqueId', 'Name of page', '/url/of/page/', [], []);
        expect(testPage.id).to.exist;
        expect(testPage.name).to.exist;
        expect(testPage.path).to.exist;
        expect(testPage.elementsToTest).to.exist;
        expect(testPage.elementsToIgnore).to.exist;
        expect(testPage.id).to.be.a('string');
        expect(testPage.name).to.be.a('string');
        expect(testPage.path).to.be.a('string');
        expect(testPage.elementsToTest).to.be.an('array');
        expect(testPage.elementsToIgnore).to.be.an('array');
    });
    test('should create an empty elementToIgnore array when one is not provided', () => {
        let testPage = new page_1.Page('uniqueId', 'Name of page', '/url/of/page/', []);
        expect(testPage.elementsToIgnore).to.exist;
        expect(testPage.elementsToIgnore).to.be.an('array');
        expect(testPage.elementsToIgnore).to.have.lengthOf(0);
    });
    test('should create an empty elementToIgnore array when one is not provided', () => {
        let testPage = new page_1.Page('uniqueId', 'Name of page', '/url/of/page/', []);
        expect(testPage.elementsToIgnore).to.exist;
        expect(testPage.elementsToIgnore).to.be.an('array');
        expect(testPage.elementsToIgnore).to.have.lengthOf(0);
    });
});
//# sourceMappingURL=page.js.map