import { FileValidationErrorType } from '../enums';

export type FileValidator = (file: File) => ValidationResult;

interface ValidationSuccess {
  isValid: true;
}

export interface ValidationFailure {
  isValid: false;
  errorType: FileValidationErrorType; // A machine-readable error identifier
  details?: Record<string, any>; // Optional additional context
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export interface MaxSizeExceededDetails {
  maxSize: string;
  actualSize: string;
}

export interface FileTypeNotAllowedDetails {
  fileType: string;
  allowedTypes: string[];
}

export interface FilenameAlreadyExistsDetails {
  filename: string;
}

export interface MaxFileCountExceededDetails {
  currentCount: number;
  maxCount: number;
}

export interface FilenameNotAllowedDetails {
  filename: string;
}

export type UnknownErrorDetails = Record<string, any>;
