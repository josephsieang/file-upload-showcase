import { FileValidator, ValidationResult } from '../models';

export const createMaxSizeValidator = (maxSize: number): FileValidator => {
  return (file: File): ValidationResult => ({
    isValid: file.size <= maxSize,
    error: file.size > maxSize ? `File size must not exceed ${maxSize / 1024 / 1024}MB` : undefined
  });
};

export const createFileTypeValidator = (allowedTypes: string[]): FileValidator => {
  return (file: File): ValidationResult => ({
    isValid: allowedTypes.includes(file.type),
    error: !allowedTypes.includes(file.type) ? `File type ${file.type} is not allowed` : undefined
  });
};

export const createFilenameValidator = (existingFiles: File[]): FileValidator => {
  return (file: File): ValidationResult => ({
    isValid: !existingFiles.some((f) => f.name === file.name),
    error: existingFiles.some((f) => f.name === file.name) ? `File ${file.name} already exists` : undefined
  });
};

export const createFileCountValidator = (maxFiles: number, existingFiles: File[]): FileValidator => {
  return (_file: File): ValidationResult => ({
    isValid: existingFiles.length < maxFiles,
    error: existingFiles.length >= maxFiles ? `Maximum number of files exceeded` : undefined
  });
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
