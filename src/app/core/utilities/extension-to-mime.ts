export function extensionToMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',

    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.rtf': 'application/rtf',

    // Spreadsheets
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Archives
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',

    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',

    // Video
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',

    // Code
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.csv': 'text/csv'
  };

  return mimeTypes[extension.toLowerCase()] || '';
}
