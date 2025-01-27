import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

import { MessageNotificationService } from "../../../../core/services/message-notification.service";

@Component({
    selector: 'app-message-notification',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './message-notification.component.html',
    styleUrl: './message-notification.component.scss'
})
export class MessageNotificationComponent implements OnInit, OnDestroy {

    @ViewChild('toastTemplate') toastTemplate!: TemplateRef<any>;

    private messageNotificationService = inject(MessageNotificationService);
    _snackBar = inject(MatSnackBar);

    subscription?: Subscription;

    message: string = '';
    type?: 'success' | 'error';

    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    ngOnInit() {
        this.subscription = this.messageNotificationService.getMessage().subscribe(messageDetails => {
            if (messageDetails) {
                this.message = messageDetails.message;
                this.type = messageDetails.type;
                this.openSnackBar();
            }
        })
    }

    openSnackBar() {
        this._snackBar.openFromTemplate(this.toastTemplate, {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: this.type === 'success' ? 'toast-success' : 'toast-error'
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}