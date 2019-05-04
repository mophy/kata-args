import Arguments from './arguments';
import ArgumentTypes from './argument-types';
import ArgumentTokenizer from './argument-tokenizer';
import ArgumentSchemas from './argument-schemas';

const VALUE_CONVERTERS = {
    [ArgumentTypes.STRING]: value => value,
    [ArgumentTypes.INTEGER]: value => parseInt(value, 10),
    [ArgumentTypes.STRINGS]: value => value.split(',').map(VALUE_CONVERTERS[ArgumentTypes.STRING]),
    [ArgumentTypes.INTEGERS]: value => value.split(',').map(VALUE_CONVERTERS[ArgumentTypes.INTEGER]),
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
        return schema.isBoolean() ? true : this.nextValue(schema);
    }

    nextValue(schema) {
        return this.convertValue(schema.type, this.tokens.nextValue(schema.flag));
    }

    convertValue(type, value) {
        return VALUE_CONVERTERS[type](value);
    }

}
