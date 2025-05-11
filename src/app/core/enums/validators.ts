export enum FileValidationErrorType {
  MaxSizeExceeded = 'MAX_SIZE_EXCEEDED',
  FileTypeNotAllowed = 'FILE_TYPE_NOT_ALLOWED',
  FilenameNotAllowed = 'FILENAME_NOT_ALLOWED',
  FilenameAlreadyExists = 'FILENAME_ALREADY_EXISTS',
  MaxFileCountExceeded = 'MAX_FILE_COUNT_EXCEEDED',
  UnknownError = 'UNKNOWN_ERROR' // Fallback
}
