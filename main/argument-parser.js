import Arguments from './arguments';
import ArgumentTypes from './argument-types';
import ArgumentTokenizer from './argument-tokenizer';
import ArgumentSchemas from './argument-schemas';

const VALUE_CONVERTERS = {
    [ArgumentTypes.STRING]: value => value,
    [ArgumentTypes.INTEGER]: value => parseInt(value, 10),
};

export default class ArgumentParser {

    constructor(schemas) {
        this.schemas = new ArgumentSchemas(schemas);
    }

    parse(input) {
        this.createArguments();
        this.tokenizeInput(input);
        return this.parseTokens();
    }

    createArguments() {
        this.args = new Arguments(this.schemas);
    }

    tokenizeInput(input) {
        this.tokens = new ArgumentTokenizer(input);
    }

    parseTokens() {
        while (this.tokens.hasMore()) this.parseToken();
        return this.args;
    }

    parseToken() {
        let flag = this.tokens.nextFlag();
        let arg = this.args.get(flag);
        let schema = this.schemas.get(flag);
        arg.value = this.parseArgumentValue(schema);
    }

    parseArgumentValue(schema) {
        return VALUE_PARSERS[schema.type].call(this, schema);
    }

    nextValue(schema) {
        return this.convertValue(schema.type, this.tokens.nextValue(schema.flag));
    }

    convertValue(type, value) {
        return VALUE_CONVERTERS[type](value);
    }

}

const VALUE_PARSERS = {
    [ArgumentTypes.BOOLEAN]: () => true,
    [ArgumentTypes.STRING]: ArgumentParser.prototype.nextValue,
    [ArgumentTypes.INTEGER]: ArgumentParser.prototype.nextValue,
};
