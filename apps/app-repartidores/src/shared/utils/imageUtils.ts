/**
 * Validates that an image file is under 5MB and is of a supported format.
 */
export const validateImage = (file: File): boolean => {
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  return file.size <= maxSizeInBytes && validTypes.includes(file.type);
};

export const createMultipartFormData = (file: File, key: string): FormData => {
  const formData = new FormData();
  formData.append(key, file);
  return formData;
};