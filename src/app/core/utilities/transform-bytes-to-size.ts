export function transformBytesToSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = parseFloat((bytes / Math.pow(1024, index)).toFixed(2));

  return `${size} ${sizes[index]}`;
}
