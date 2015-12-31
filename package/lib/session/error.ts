export default class Error {

    public error;
    public args: Array<any>;
    public kwargs: Object;

    constructor(error, args?: Array<any>, kwargs?: Object) {
        this.error = error;
        this.args = args || [];
        this.kwargs = kwargs || {};
    }
}
