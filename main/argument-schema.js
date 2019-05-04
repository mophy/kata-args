import ArgumentTypes from './argument-types';

export default class ArgumentSchema {

    constructor(flag, type) {
        this.flag = flag;
        this.type = type;
    }

    isBoolean() {
        return this.type === ArgumentTypes.BOOLEAN;
    }

}
