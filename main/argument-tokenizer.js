import ArgumentToken from './argument-token';

export default class ArgumentTokenizer {

    constructor(input) {
        this.tokens = this.tokenize(input).map(this.createToken);
    }

    tokenize(input) {
        return input ? input.split(' ') : [];
    }

    createToken(token) {
        return new ArgumentToken(token);
    }

    hasMore() {
        return !!this.tokens.length;
    }

    nextFlag() {
        return this.nextToken().asFlag();
    }

    nextValue(flag) {
        return this.nextToken().asValue(flag);
    }

    nextToken() {
        return this.tokens.shift() || this.nullToken();
    }

    nullToken() {
        return this.createToken(null);
    }

}
