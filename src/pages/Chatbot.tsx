import React, { useState } from "react";
import axios from "axios";
import { ChatMessage } from "../pages/ChatMessage";
import { ChatInput } from "../pages/ChatInput";
import { useVoiceRecording } from "../hooks/useVoiceRecording";
import { sendMessage, sendVoiceMessage } from "../services/api";
import type { Message } from "../types/chat";
import evolvaContent from "../assets/images/evolva_content.png";
import evolvaLogo from "../assets/images/logoChatbot.png";
import { useNavigate } from "react-router-dom";

function Chatbot() {
  const accessToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("username") || "Anonymous";

  axios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, startRecording, stopRecording, getAudioBlob } =
    useVoiceRecording();

  const navigate = useNavigate();

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
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <img src={evolvaLogo} alt="Evolva" className="h-9 w-9 mr-2" />
          <span className="text-2xl font-semibold text-[#233A66]">Evolva</span>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
        >
          <i className="fa-solid fa-house text-[#233A66] hover:text-blue-400 text-xl"></i>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img src={evolvaContent} alt="Welcome" className="w-48 h-48 mb-4" />
            <h2 className="text-2xl text-blue-400 mb-2">Hi, {username}</h2>
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
            <div className="animate-pulse text-gray-500">Thinking....</div>
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

export default Chatbot;
