import axios from "axios";

const API_URL = "https://moodydev-evolva.hf.space/api";

export const sendMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const sendVoiceMessage = async (
  audioBlob: Blob
): Promise<{ transcription: string; audioUrl?: string }> => {
  try {
    // Convert blob to File object with proper mime type
    const file = new File([audioBlob], "voice-message.webm", {
      type: "audio/webm",
    });
    const formData = new FormData();
    formData.append("audio", file);

    const response = await axios.post(`${API_URL}/speech-to-text`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "json",
    });

    return response.data;
  } catch (error) {
    console.error("Error sending voice message:", error);
    throw error;
  }
};

export const textToSpeech = async (text: string): Promise<Blob> => {
  try {
    const response = await axios.post(
      `${API_URL}/text-to-speech`,
      { text },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
};
