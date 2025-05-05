import React, { createContext, useContext, useState } from "react";

const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotionData, setEmotionData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    confidence: 0,
    anxiety: 0,
    stress: 0,
    primaryEmotion: "neutral",
    peakStress: 0,
    emotionalStability: 0,
  });
  const [error, setError] = useState(null);

  const resetSession = () => {
    setEmotionData([]);
    setSummaryStats({
      confidence: 0,
      anxiety: 0,
      stress: 0,
      primaryEmotion: "neutral",
      peakStress: 0,
      emotionalStability: 0,
    });
    setError(null);
  };

  return (
    <EmotionContext.Provider
      value={{
        emotionData,
        setEmotionData,
        summaryStats,
        setSummaryStats,
        error,
        setError,
        resetSession,
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => useContext(EmotionContext);
