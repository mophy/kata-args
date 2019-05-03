import Argument from './argument';
import ArgumentTypes from './argument-types';

const DEFAULT_VALUES = {
    [ArgumentTypes.BOOLEAN]: false,
    [ArgumentTypes.STRING]: '',
    [ArgumentTypes.INTEGER]: 0,
};

export default class Arguments extends Array {

    constructor(schemas) {
        super(...schemas.map(Arguments.createArgument));
    }

    static createArgument(schema) {
        return new Argument(schema.flag, DEFAULT_VALUES[schema.type]);
    }

    get(flag) {
        return this.find(arg => arg.flag === flag);
    }

}
