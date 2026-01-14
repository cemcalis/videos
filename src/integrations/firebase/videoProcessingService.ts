// Video processing utilities for automatic thumbnail generation and duration calculation
export class VideoProcessingService {
  // Calculate video duration from file
  static async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  // Generate thumbnail from video file
  static async generateThumbnail(file: File, time: number = 1): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.currentTime = time;

      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = (video.videoHeight / video.videoWidth) * 320;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        }
        window.URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Failed to process video for thumbnail'));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  // Format duration in HH:MM:SS or MM:SS format
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Process video file and return metadata
  static async processVideoFile(file: File): Promise<{
    duration: number;
    formattedDuration: string;
    thumbnailBlob?: Blob;
  }> {
    try {
      const duration = await this.getVideoDuration(file);
      const formattedDuration = this.formatDuration(duration);

      // Generate thumbnail from 1 second into the video
      const thumbnailBlob = await this.generateThumbnail(file, Math.min(1, duration * 0.1));

      return {
        duration,
        formattedDuration,
        thumbnailBlob,
      };
    } catch (error) {
      console.error('Error processing video file:', error);
      // Return basic info if processing fails
      return {
        duration: 0,
        formattedDuration: '00:00',
      };
    }
  }
}
