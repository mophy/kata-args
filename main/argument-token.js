import ArgumentError from './argument-error';

export default class ArgumentToken {

    constructor(token) {
        this.token = token;
    }

    asFlag() {
        if (!this.isFlag()) ArgumentError.unexpectedValue(this.token);
        return this.token.substring(1);
    }

    asValue(flag) {
        if (!this.isValue()) ArgumentError.valueNotSpecified(flag);
        return this.token;
    }

    isFlag() {
        return this.token && this.token.match(/^-[a-zA-Z]$/);
    }

    isValue() {
        return this.token && !this.isFlag();
    }

}
