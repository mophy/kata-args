import ArgumentParser from '../main/argument-parser';
import ArgumentSchema from '../main/argument-schema';
import ArgumentTypes from '../main/argument-types';
import Argument from '../main/argument';

const BOOLEAN = ArgumentTypes.BOOLEAN;
const STRING = ArgumentTypes.STRING;
const INTEGER = ArgumentTypes.INTEGER;
const STRINGS = ArgumentTypes.STRINGS;
const INTEGERS = ArgumentTypes.INTEGERS;

function expectParseSucceed(input, params) {
    let schemas = params.map(param => new ArgumentSchema(param.flag, param.type));
    let argumentParser = new ArgumentParser(schemas);

    let result = argumentParser.parse(input);

    expect(result).toHaveLength(params.length);
    params.forEach((param, i) => {
        expect(result[i]).toBeInstanceOf(Argument);
        expect(result[i]).toMatchObject({ flag: param.flag, value: param.expected });
    });
}

function expectParseFailed(input, params, err) {
    let schemas = params.map(param => new ArgumentSchema(param.flag, param.type));
    let argumentParser = new ArgumentParser(schemas);

    expect(() => argumentParser.parse(input)).toThrow(err);
}

describe('ArgumentParser', () => {

    describe('default values', () => {

        it('should return default value for boolean schema', () => {
            expectParseSucceed('', [
                { flag: 'x', type: BOOLEAN, expected: false },
            ]);
        });

        it('should return default value for string schema', () => {
            expectParseSucceed('', [
                { flag: 'x', type: STRING, expected: '' },
            ]);
        });

        it('should return default value for integer schema', () => {
            expectParseSucceed('', [
                { flag: 'x', type: INTEGER, expected: 0 },
            ]);
        });

        it('should return default value for multiple schema', () => {
            expectParseSucceed('', [
                { flag: 'b', type: BOOLEAN, expected: false },
                { flag: 's', type: STRING, expected: '' },
                { flag: 'i', type: INTEGER, expected: 0 },
            ]);
        });

    });

    describe('invalid flags', () => {

        it('should throw error if flag is unrecognized', () => {
            expectParseFailed('-b', [
            ], /unrecognized flag: -b/i);
        });

        it('should throw error if non-flag data is passed first', () => {
            expectParseFailed('b', [
            ], /unexpected value: b/i);
        });

    });

    describe('with 1 argument', () => {

        it('should handle boolean argument', () => {
            expectParseSucceed('-b', [
                { flag: 'b', type: BOOLEAN, expected: true },
            ]);
        });

        it('should throw error if string value not passed', () => {
            expectParseFailed('-s', [
                { flag: 's', type: STRING },
            ], /value not specified for flag -s/i);
        });

        it('should throw error if integer value not passed', () => {
            expectParseFailed('-i', [
                { flag: 'i', type: INTEGER },
            ], /value not specified for flag -i/i);
        });

        it('should handle string argument', () => {
            expectParseSucceed('-s hello', [
                { flag: 's', type: STRING, expected: 'hello' },
            ]);
        });

        it('should handle integer argument', () => {
            expectParseSucceed('-i 123', [
                { flag: 'i', type: INTEGER, expected: 123 },
            ]);
        });

        it('should handle negative integer argument', () => {
            expectParseSucceed('-i -123', [
                { flag: 'i', type: INTEGER, expected: -123 },
            ]);
        });

    });

    describe('with 2 arguments', () => {

        it('should handle boolean and integer argument', () => {
            expectParseSucceed('-b -i 123', [
                { flag: 'b', type: BOOLEAN, expected: true },
                { flag: 'i', type: INTEGER, expected: 123 },
            ]);
        });

        it('should handle integer and boolean argument', () => {
            expectParseSucceed('-i 123 -b', [
                { flag: 'b', type: BOOLEAN, expected: true },
                { flag: 'i', type: INTEGER, expected: 123 },
            ]);
        });

        it('should throw error if integer value not passed', () => {
            expectParseFailed('-i -b', [
                { flag: 'b', type: BOOLEAN },
                { flag: 'i', type: INTEGER },
            ], /value not specified for flag -i/i);
        });

        it('should handle negative integer and boolean argument', () => {
            expectParseSucceed('-i -123 -b', [
                { flag: 'b', type: BOOLEAN, expected: true },
                { flag: 'i', type: INTEGER, expected: -123 },
            ]);
        });

    });

    describe('with 3 arguments', () => {

        it('should handle boolean, integer and string arguments', () => {
            expectParseSucceed('-s hello -b -i 123', [
                { flag: 's', type: STRING, expected: 'hello' },
                { flag: 'b', type: BOOLEAN, expected: true },
                { flag: 'i', type: INTEGER, expected: 123 },
            ]);
        });

        it('should handle duplicated integer arguments', () => {
            expectParseSucceed('-i 123 -b -i 456', [
                { flag: 'b', type: BOOLEAN, expected: true },
                { flag: 'i', type: INTEGER, expected: 456 },
            ]);
        });

    });

    describe('with lists', () => {

        it('should handle string list arguments', () => {
            expectParseSucceed('-g this,is,a,list', [
                { flag: 'g', type: STRINGS, expected: ['this', 'is', 'a', 'list'] },
            ]);
        });

        it('should handle integer list arguments', () => {
            expectParseSucceed('-d 1,2,-3,5', [
                { flag: 'd', type: INTEGERS, expected: [1, 2, -3, 5] },
            ]);
        });

        it('should handle string list and integer list arguments', () => {
            expectParseSucceed('-g this,is,a,list -d 1,2,-3,5', [
                { flag: 'g', type: STRINGS, expected: ['this', 'is', 'a', 'list'] },
                { flag: 'd', type: INTEGERS, expected: [1, 2, -3, 5] },
            ]);
        });

    });

});
