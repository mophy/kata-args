import Argument from './argument';
import ArgumentError from './argument-error';
import ArgumentTypes from './argument-types';

const DEFAULT_VALUES = {
    [ArgumentTypes.BOOLEAN]: false,
    [ArgumentTypes.STRING]: '',
    [ArgumentTypes.INTEGER]: 0,
};

const VALUE_PARSERS = {
    [ArgumentTypes.BOOLEAN]: () => true,
    [ArgumentTypes.STRING]: value => value,
    [ArgumentTypes.INTEGER]: value => parseInt(value, 10),
};

export default class ArgumentParser {

    constructor(schemas) {
        this.schemas = schemas;
        this.createArguments();
    }

    parse(input) {
        this.tokenizeInput(input);
        return this.parseTokens();
    }

    createArguments() {
        this.args = this.schemas.map(this.createArgument);
    }

    tokenizeInput(input) {
        this.tokens = input ? input.split(' ') : [];
    }

    parseTokens() {
        while (this.tokens.length) this.parseToken();
        return this.args;
    }

    createArgument(schema) {
        return new Argument(schema.flag, DEFAULT_VALUES[schema.type]);
    }

    parseToken() {
        let flag = this.nextFlag();
        let arg = this.getArgument(flag);
        arg.value = this.parseArgumentValue(this.getSchema(flag));
    }

    nextFlag() {
        return this.parseFlag(this.nextFlagToken());
    }

    getArgument(flag) {
        return this.args.find(arg => arg.flag === flag);
    }

    parseArgumentValue(schema) {
        return (schema.type !== ArgumentTypes.BOOLEAN) ? this.nextValueToken(schema) : true;
    }

    getSchema(flag) {
        let schema = this.schemas.find(s => s.flag === flag);
        if (!schema) ArgumentError.unrecognizedFlag(flag);
        return schema;
    }

    nextFlagToken() {
        let token = this.tokens.shift();
        if (!this.isFlag(token)) ArgumentError.unexpectedValue(token);
        return token;
    }

    parseFlag(token) {
        return token.substring(1);
    }

    isFlag(token) {
        return token && token.match(/^-[a-zA-Z]$/);
    }

    isValue(token) {
        return token && !this.isFlag(token);
    }

    nextValueToken(schema) {
        let token = this.ensureNextTokenIsValue(schema.flag);
        return this.parseValue(schema.type, token);
    }

    parseValue(type, token) {
        return VALUE_PARSERS[type](token);
    }

    ensureNextTokenIsValue(flag) {
        let token = this.tokens.shift();
        if (!this.isValue(token)) ArgumentError.valueNotSpecified(flag);
        return token;
    }

}
