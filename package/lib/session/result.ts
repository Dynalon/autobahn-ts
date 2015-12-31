export default class Result {

    public args: Array<any>;
    public kwargs: Object;

    constructor(args, kwargs) {

        this.args = args || [];
        this.kwargs = kwargs || {};
    }
}
