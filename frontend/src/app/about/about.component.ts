import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FileUploaderComponent } from '../core/components/file-uploader/file-uploader.component';
import { ToggleLayoutDirective } from '../core/directives/toggle-layout.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ToggleLayoutDirective,
        MatIconModule,
        MatButtonModule,
        FileUploaderComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  fileUploadConfig = {
    API: '',
    MIME_types_accepted: "application/pdf",
    isMultipleSelection: true,
    data: null
  };

}
