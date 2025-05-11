import {
  MaxSizeExceededDetails,
  FileTypeNotAllowedDetails,
  FilenameAlreadyExistsDetails,
  MaxFileCountExceededDetails,
  FilenameNotAllowedDetails,
  UnknownErrorDetails
} from '../models/validators';
import { FileValidator, ValidationFailure, ValidationResult } from '../models';
import { transformBytesToSize } from './transform-bytes-to-size';
import { FileValidationErrorType } from '../enums';

export const createMaxSizeValidator = (maxSize: number): FileValidator => {
  return (file: File): ValidationResult => {
    if (file.size > maxSize) {
      return {
        isValid: file.size <= maxSize,
        errorType: FileValidationErrorType.MaxSizeExceeded,
        details: {
          maxSize: transformBytesToSize(maxSize),
          actualSize: transformBytesToSize(file.size)
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

const formatMaxSizeExceeded = (details: MaxSizeExceededDetails) =>
  `File size exceeds the maximum limit of ${details.maxSize}. Actual size: ${details.actualSize}.`;

const formatFileTypeNotAllowed = (details: FileTypeNotAllowedDetails) =>
  `File type "${details.fileType}" is not allowed. Allowed types: ${details.allowedTypes.join(', ')}.`;

const formatFilenameAlreadyExists = (details: FilenameAlreadyExistsDetails) =>
  `Filename "${details.filename}" already exists. Please choose a different name.`;

const formatMaxFileCountExceeded = (details: MaxFileCountExceededDetails) =>
  `Maximum file count exceeded. Current count: ${details.currentCount}, Maximum allowed: ${details.maxCount}.`;

const formatFilenameNotAllowed = (details: FilenameNotAllowedDetails) =>
  `Filename "${details.filename}" already exists. Please choose a different name.`;

const formatUnknownError = (details: UnknownErrorDetails) =>
  `Unknown error occurred. Details: ${JSON.stringify(details)}`;

const errorFormatters: Record<FileValidationErrorType, (details: any) => string> = {
  [FileValidationErrorType.MaxSizeExceeded]: formatMaxSizeExceeded,
  [FileValidationErrorType.FileTypeNotAllowed]: formatFileTypeNotAllowed,
  [FileValidationErrorType.FilenameAlreadyExists]: formatFilenameAlreadyExists,
  [FileValidationErrorType.MaxFileCountExceeded]: formatMaxFileCountExceeded,
  [FileValidationErrorType.FilenameNotAllowed]: formatFilenameNotAllowed,
  [FileValidationErrorType.UnknownError]: formatUnknownError
};

export const parsingFileValidationError = (error: ValidationFailure): string =>
  errorFormatters[error.errorType](error.details);
