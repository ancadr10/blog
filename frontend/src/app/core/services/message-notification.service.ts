import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MessageNotificationService {
    private readonly subject = new Subject();

    setMessage(message: string, type: string) {
        this.subject.next({ message, type });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}