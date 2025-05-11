import { FileValidationErrorType } from '../enums';
import { FileValidator, ValidationResult } from '../models';

export const createMaxSizeValidator = (maxSize: number): FileValidator => {
  return (file: File): ValidationResult => {
    if (file.size > maxSize) {
      return {
        isValid: file.size <= maxSize,
        errorType: FileValidationErrorType.MaxSizeExceeded,
        details: {
          maxSize: maxSize,
          actualSize: file.size
        }
      };
    }
    return { isValid: true };
  };
};

export const createFileTypeValidator = (allowedTypes: string[]): FileValidator => {
  return (file: File): ValidationResult => {
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorType: FileValidationErrorType.FileTypeNotAllowed,
        details: {
          fileType: file.type,
          allowedTypes
        }
      };
    }
    return { isValid: true };
  };
};

export const createFilenameValidator = (existingFiles: File[]): FileValidator => {
  return (file: File): ValidationResult => {
    if (existingFiles.some((f) => f.name === file.name)) {
      return {
        isValid: false,
        errorType: FileValidationErrorType.FilenameAlreadyExists,
        details: {
          filename: file.name
        }
      };
    }
    return { isValid: true };
  };
};

export const createFileCountValidator = (maxFiles: number, existingFiles: File[]): FileValidator => {
  return (_file: File): ValidationResult => {
    if (existingFiles.length >= maxFiles) {
      return {
        isValid: false,
        errorType: FileValidationErrorType.MaxFileCountExceeded,
        details: {
          currentCount: existingFiles.length,
          maxCount: maxFiles
        }
      };
    }
    return { isValid: true };
  };
};

export const composeFileValidators = (...validators: FileValidator[]): FileValidator => {
  return (file: File): ValidationResult => {
    for (const validator of validators) {
      const result = validator(file);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};
