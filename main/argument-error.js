export default class ArgumentError {

    static unrecognizedFlag(flag) {
        throw new Error(`Unrecognized flag: -${flag}.`);
    }

    static unexpectedValue(token) {
        throw new Error(`Unexpected value: ${token}`);
    }

    static valueNotSpecified(flag) {
        throw new Error(`Value not specified for flag -${flag}`);
    }

}
