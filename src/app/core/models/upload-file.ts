export interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  id: string;
}
