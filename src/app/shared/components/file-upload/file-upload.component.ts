import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { UploadFile, UploadStatus } from '../../../core/models';
import { extensionToMimeType, transformBytesToSize } from '../../../core/utilities';
import {
  composeFileValidators,
  createMaxSizeValidator,
  createFileTypeValidator,
  createFilenameValidator,
  createFileCountValidator
} from '../../../core/utilities/file-validators';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [
    trigger('fileAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))])
    ])
  ]
})
export class FileUploadComponent {
  readonly maxFileSizeMb = input(1);
  readonly acceptedFileTypes = input(['.jpg', '.jpeg', '.png', '.pdf']);
  readonly allowMultiple = input(false);
  readonly filesChanged = output<File[]>();

  files: UploadFile[] = [];
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(droppedFiles);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files || []);
    this.handleFiles(selectedFiles);
  }

  removeFile(id: string) {
    const index = this.files.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.files.splice(index, 1);
      this.filesChanged.emit(this.files.map((f) => f.file));
    }
  }

  uploadFiles() {
    // Simulate file upload - replace with your actual upload logic
    this.files.forEach((file) => {
      if (file.status === 'pending') {
        file.status = 'uploading';

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          file.progress = progress;

          if (progress >= 100) {
            clearInterval(interval);
            file.status = 'done';
          }
        }, 300);
      }
    });
  }

  formatFileSize(bytes: number): string {
    return transformBytesToSize(bytes);
  }

  getStatusText(status: UploadStatus): string {
    switch (status) {
      case 'pending':
        return 'Ready to upload';
      case 'uploading':
        return 'Uploading...';
      case 'done':
        return 'Uploaded';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  }

  hasPendingFiles(): boolean {
    return this.files.some((file) => file.status === 'pending');
  }

  getAcceptedTypesDisplay(): string {
    return this.acceptedFileTypes()
      .map((ext) => ext.replace('.', '').toUpperCase())
      .join(', ');
  }

  getFileIcon(file: File): string {
    const mimeType = file.type.toLowerCase();

    if (mimeType.startsWith('image/')) {
      return 'fas fa-file-image';
    } else if (mimeType === 'application/pdf') {
      return 'fas fa-file-pdf';
    } else if (mimeType === 'text/plain') {
      return 'fas fa-file-alt';
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return 'fas fa-file-excel';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'fas fa-file-word';
    } else if (mimeType.startsWith('video/')) {
      return 'fas fa-file-video';
    } else if (mimeType.startsWith('audio/')) {
      return 'fas fa-file-audio';
    } else if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return 'fas fa-file-archive';
    } else if (mimeType === 'text/csv') {
      return 'fas fa-file-csv';
    } else if (mimeType.includes('json') || mimeType.includes('xml')) {
      return 'fas fa-file-code';
    }

    return 'fas fa-file';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private handleFiles(newFiles: File[]) {
    newFiles.forEach((file) => {
      const validationResult = composeFileValidators(
        createFileCountValidator(
          this.allowMultiple() ? Infinity : 1,
          this.files.map((f) => f.file)
        ),
        createMaxSizeValidator(this.maxFileSizeMb() * 1024 * 1024),
        createFileTypeValidator(
          this.acceptedFileTypes()
            .map((ext) => extensionToMimeType(ext))
            .filter((mime) => mime !== '')
        ),
        createFilenameValidator(this.files.map((f) => f.file))
      )(file);

      if (validationResult.isValid) {
        this.files.push({
          file,
          progress: 0,
          status: 'pending',
          id: this.generateId()
        });
      } else {
        // Show error using your preferred notification system
        // alert(validationResult.error);
      }
    });

    this.filesChanged.emit(this.files.map((f) => f.file));
  }
}
