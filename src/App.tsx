import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { useVoiceRecording } from "./hooks/useVoiceRecording";
import { sendMessage, sendVoiceMessage } from "./services/api";
import type { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, startRecording, stopRecording, getAudioBlob } =
    useVoiceRecording();

  const handleSendMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return;
    setIsLoading(true);

    const userMessage: Message = { role: "user", content, isVoice };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await sendMessage(content);
      const botMessage: Message = {
        role: "assistant",
        content: response.message,
      };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceMessage = async () => {
    const audioBlob = await getAudioBlob();
    if (audioBlob) {
      try {
        const response = await sendVoiceMessage(audioBlob);
        handleSendMessage(response.transcription, true);
      } catch (error) {
        console.error("Error sending voice message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center">
        <div className="flex items-center">
          <img
            src="https://raw.githubusercontent.com/stackblitz/content/main/public/robot-logo.png"
            alt="Evolva"
            className="h-8 w-8 mr-2"
          />
          <span className="text-xl font-semibold text-gray-800">Evolva</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img
              src="https://raw.githubusercontent.com/stackblitz/content/main/public/robot-welcome.png"
              alt="Welcome"
              className="w-32 h-32 mb-4"
            />
            <h2 className="text-2xl text-blue-400 mb-2">Hi, Ali</h2>
            <p className="text-3xl text-blue-400">
              What would you like to know?
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Thinking...</div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={() => {
              stopRecording();
              handleVoiceMessage();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
