
/**
 * Utility functions for photo validation
 */

/**
 * Extracts EXIF data from an image file to check when it was taken
 * @param file The image file to analyze
 * @returns Promise that resolves to a Date object if creation date is found, null otherwise
 */
export const getPhotoCreationDate = (file: File): Promise<Date | null> => {
  return new Promise((resolve) => {
    // For demonstration purposes, we'll simulate EXIF data extraction
    // In a real app, you would use a library like exif-js to extract actual metadata
    
    // Simulate date extraction process
    const reader = new FileReader();
    
    reader.onload = () => {
      // Simulate successful metadata extraction
      // In a real implementation, this would parse EXIF data
      
      // For demo, let's use a 50/50 chance of returning today's date or a date from the past
      const today = new Date();
      
      if (Math.random() > 0.5) {
        // Return today's date (valid)
        resolve(today);
      } else {
        // Return a date from 3 months ago (potentially invalid)
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 3);
        resolve(pastDate);
      }
    };
    
    reader.onerror = () => {
      // If we can't read the file, return null
      resolve(null);
    };
    
    reader.readAsArrayBuffer(file.slice(0, 128 * 1024)); // Read first 128KB to look for EXIF data
  });
};

/**
 * Checks if a photo was taken during a contest's active period
 * @param photoDate Date the photo was taken
 * @param contestStartDate Contest start date
 * @param contestEndDate Contest end date
 * @returns Boolean indicating if the photo is valid for the contest
 */
export const isPhotoTakenDuringContest = (
  photoDate: Date | null,
  contestStartDate: Date,
  contestEndDate: Date
): boolean => {
  if (!photoDate) {
    // If we can't determine when the photo was taken, assume it's valid
    // In a real app, you might want to use a different policy
    return true;
  }
  
  return photoDate >= contestStartDate && photoDate <= contestEndDate;
};

/**
 * Validates a photo file for a given contest
 * @param file The photo file
 * @param contestStartDate Contest start date
 * @param contestEndDate Contest end date
 * @returns Promise that resolves to an object with validation status and messages
 */
export const validatePhotoForContest = async (
  file: File,
  contestStartDate: Date,
  contestEndDate: Date
): Promise<{ isValid: boolean; message: string }> => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { 
      isValid: false, 
      message: 'Please upload an image file (JPEG or PNG)' 
    };
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      message: 'Image size should be less than 10MB'
    };
  }
  
  // Get photo creation date from EXIF data
  const photoDate = await getPhotoCreationDate(file);
  
  // Check if photo was taken during contest period
  if (!isPhotoTakenDuringContest(photoDate, contestStartDate, contestEndDate)) {
    return {
      isValid: false,
      message: 'Photo must be taken during the active contest period'
    };
  }
  
  // All validations passed
  return {
    isValid: true,
    message: 'Photo is valid for submission'
  };
};
