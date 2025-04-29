import { useState, useCallback, useRef } from "react";

interface VoiceRecordingHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  getAudioBlob: () => Promise<Blob | null>;
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // Collect data every 100ms for more granular recording
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw new Error("Could not start recording");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const getAudioBlob = useCallback(async (): Promise<Blob | null> => {
    if (chunksRef.current.length === 0) return null;

    // Create blob from chunks
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = []; // Clear chunks after getting blob

    return blob;
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    getAudioBlob,
  };
};
