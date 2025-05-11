import { FileValidationErrorType } from '../enums';

export type FileValidator = (file: File) => ValidationResult;

interface ValidationSuccess {
  isValid: true;
}

interface ValidationFailure {
  isValid: false;
  errorType: FileValidationErrorType; // A machine-readable error identifier
  details?: Record<string, any>; // Optional additional context
}

export type ValidationResult = ValidationSuccess | ValidationFailure;
