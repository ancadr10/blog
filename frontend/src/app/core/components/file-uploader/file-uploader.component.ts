import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageNotificationService } from '../../services/message-notification.service';


@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent implements OnInit {

  @Input() config!: {
    API: string;
    MIME_types_accepted: string;
    isMultipleSelection: boolean;
    data: any
  };

  selectedFiles: {
    file: File;
    uploadInProgress: boolean;
    uploadResult: any
  }[] = [];

  fb = inject(FormBuilder);
  messageNotificationService = inject(MessageNotificationService);

  @ViewChild('fileSelector', { static: false }) fileSelector!: ElementRef;

  form = this.fb.group({
    fileSelection: ['']
  });

  private fileSelectionInputSubscription!: Subscription;


  ngOnInit(): void {
    this.fileSelectionInputSubscription = this.form.get('fileSelection')!.valueChanges.subscribe(value => {
      const fileSelectionInput = this.fileSelector.nativeElement;
      this.processSelectedFiles(fileSelectionInput.files);
      this.fileSelector.nativeElement.value = '';
    });
  }

  processSelectedFiles(filesObs: FileList) {
    let incorrectType = false;
    for (let i = 0; i < filesObs.length; i++) {
      const file = filesObs[i];
      console.log(this.config.MIME_types_accepted);

      if (this.config.MIME_types_accepted.indexOf(file.type) >= 0) {
        console.log(file);
        let selectedFile = {
          file,
          uploadInProgress: false,
          uploadResult: null
        };
        this.selectedFiles.push(selectedFile);

      } else {
        incorrectType = true;
      }
    }
    if (incorrectType) {
      this.messageNotificationService.setMessage(`You are allowed to upload only this types: ${this.config.MIME_types_accepted}`, 'error');
    }
  }


  uploadFile(index: number) {
    let fileToUpload = this.selectedFiles[index];

    const formData = new FormData();
    formData.append('file', fileToUpload.file);

    fileToUpload.uploadInProgress = true;
    fileToUpload.uploadResult = null;
    //TODO save

  }

  openFileSelector() {
    const fileSelectionEl = this.fileSelector.nativeElement;
    fileSelectionEl.click();
  }

  onCancelFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  uploadAll() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const selectedFile = this.selectedFiles[i];
      if (!selectedFile.uploadInProgress && selectedFile.uploadResult !== 'success') {
        this.uploadFile(i);
      }
    }
  }

  cancelAll() {
    let uploadInProgress = false;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.selectedFiles[i].uploadInProgress) {
        uploadInProgress = true;
        break;
      }
    }
    if (uploadInProgress) {
      this.messageNotificationService.setMessage('Upload in progress, you are not allowed to cancel.', 'error');
      //TODO confirmation service + proceed with cancel action
    } else {
      this.removeSelections();
    }
  }

  removeSelections() {
    this.selectedFiles = [];
  }

  allFilesUploaded(): boolean {
    let allFilesUploaded = true;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const selectedFile = this.selectedFiles[i];
      if (!selectedFile.uploadInProgress && selectedFile.uploadResult !== 'success') {
        allFilesUploaded = false;
        break;
      }
    }
    return !allFilesUploaded;

  }
}
