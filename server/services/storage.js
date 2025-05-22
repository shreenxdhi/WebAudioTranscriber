// Simple in-memory storage for transcriptions
const transcriptions = [];

export const storage = {
  /**
   * Save a transcription to storage
   */
  saveTranscription: async (transcription) => {
    transcription.id = Date.now().toString();
    transcription.createdAt = new Date();
    transcriptions.push(transcription);
    return transcription;
  },

  /**
   * Get all transcriptions
   */
  getTranscriptions: async () => {
    return transcriptions;
  },

  /**
   * Get a transcription by ID
   */
  getTranscriptionById: async (id) => {
    return transcriptions.find(t => t.id === id);
  }
}; 