import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [FileUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'file-upload-showcase';
}
