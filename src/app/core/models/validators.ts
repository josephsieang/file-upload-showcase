export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type FileValidator = (file: File) => ValidationResult;
