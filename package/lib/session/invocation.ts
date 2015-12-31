export default class Invocation {

    public caller;
    public progress;
    public procedure;

    constructor(caller, progress, procedure) {

        this.caller = caller;
        this.progress = progress;
        this.procedure = procedure;
    }
}
