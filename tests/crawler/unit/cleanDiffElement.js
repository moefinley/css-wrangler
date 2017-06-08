"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const diffElement_1 = require("../../../crawler/app/diffElement");
const cleanDiffElement_1 = require("../../../crawler/app/cleanDiffElement");
const expect = chai.expect;
suite('cleanDiffElement function', () => {
    test('should remove a diff that has URLs that only differ by domain', () => {
        let testDiffElement = new diffElement_1.DiffElement('testSelector');
        let diffThatShouldBeRemoved = {
            kind: 'E',
            path: ['/'],
            lhs: 'url(http://www.domain-a.com/image.gif)',
            rhs: 'url(http://www.domain-b.com/image.gif)'
        };
        testDiffElement.diff.push(diffThatShouldBeRemoved);
        cleanDiffElement_1.cleanDiffElement(testDiffElement);
        expect(testDiffElement.diff).to.have.lengthOf(0);
    });
    test('should remove a diff that has URLs that only differ by domain when the URLs are wrapped with quotes', () => {
        let testDiffElement = new diffElement_1.DiffElement('testSelector');
        let diffThatShouldBeRemoved = {
            kind: 'E',
            path: ['/'],
            lhs: 'url("http://www.domain-a.com/image.gif")',
            rhs: 'url("http://www.domain-b.com/image.gif")'
        };
        testDiffElement.diff.push(diffThatShouldBeRemoved);
        cleanDiffElement_1.cleanDiffElement(testDiffElement);
        expect(testDiffElement.diff).to.have.lengthOf(0);
    });
    test('should not remove a diff when the URLs are different beyond the domain', () => {
        let testDiffElement = new diffElement_1.DiffElement('testSelector');
        let lhsOfTestSubject = 'url(http://www.domain-a.com/image-a.gif)';
        let diffThatShouldNotBeRemoved = {
            kind: 'E',
            path: ['/'],
            lhs: lhsOfTestSubject,
            rhs: 'url(http://www.domain-b.com/image-b.gif)'
        };
        testDiffElement.diff.push(diffThatShouldNotBeRemoved);
        cleanDiffElement_1.cleanDiffElement(testDiffElement);
        expect(testDiffElement.diff).to.have.lengthOf(1);
        expect(testDiffElement.diff[0].lhs).to.equal(lhsOfTestSubject);
    });
    test('should not remove a diff that doesn\'t have a URL', () => {
        let testDiffElement = new diffElement_1.DiffElement('testSelector');
        let lhsOfTestSubject = '#71c5ce';
        let diffThatShouldNotBeRemoved = {
            kind: 'E',
            path: ['/'],
            lhs: lhsOfTestSubject,
            rhs: '#42f492'
        };
        testDiffElement.diff.push(diffThatShouldNotBeRemoved);
        cleanDiffElement_1.cleanDiffElement(testDiffElement);
        expect(testDiffElement.diff).to.have.lengthOf(1);
        expect(testDiffElement.diff[0].lhs).to.equal(lhsOfTestSubject);
    });
    test('should not remove a diff if the diff isn\'t an edit', () => {
        let testDiffElement = new diffElement_1.DiffElement('testSelector');
        let diffThatShouldNotBeRemoved = {
            kind: 'N',
            path: ['/'],
            lhs: null,
            rhs: '#42f492'
        };
        testDiffElement.diff.push(diffThatShouldNotBeRemoved);
        cleanDiffElement_1.cleanDiffElement(testDiffElement);
        expect(testDiffElement.diff).to.have.lengthOf(1);
    });
});
//# sourceMappingURL=cleanDiffElement.js.map