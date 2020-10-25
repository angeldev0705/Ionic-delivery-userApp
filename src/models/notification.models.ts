export class MyNotification {
    title: string;
    detail: string;
    time: number;

    constructor(title: string, detail: string, time: number) {
        this.title = title;
        this.detail = detail;
        this.time = time;
    }
}