export default class Event {

    public publication;
    public publisher;
    public topic: string;

    constructor(publication, publisher, topic: string) {
        this.publication = publication;
        this.publisher = publisher;
        this.topic = topic;
    }
}
