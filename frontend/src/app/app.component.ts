import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MessageNotificationComponent } from '../app/public/core/components/message-notification/message-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MessageNotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blog';
}
