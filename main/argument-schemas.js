import ArgumentError from './argument-error';

export default class ArgumentSchemas {

    constructor(schemas) {
        this.schemas = schemas;
    }

    map(handler) {
        return this.schemas.map(handler);
    }

    get(flag) {
        let result = this.schemas.find(schema => schema.flag === flag);
        if (!result) ArgumentError.unrecognizedFlag(flag);
        return result;
    }

}
