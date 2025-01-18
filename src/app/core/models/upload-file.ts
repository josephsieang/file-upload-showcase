export interface UploadFile {
  file: File;
  progress: number;
  status: UploadStatus;
  id: string;
}

export type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';
