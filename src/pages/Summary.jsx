import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEmotion } from "./EmotionContext";

const SessionSummaryPage = () => {
  const { emotionData, summaryStats } = useEmotion();

  const sessionData = emotionData.map((item) => ({
    time: item.time,
    stress: item.stress,
    anxiety: item.anxiety,
    confidence: item.confidence,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-indigo-800">
        Session Summary
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Confidence</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {summaryStats.confidence}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Anxiety</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {summaryStats.anxiety}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Stress</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {summaryStats.stress}%
          </p>
        </div>
      </div>
      <div className="mt-8 bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Emotional Trends
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={sessionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #ddd" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#ff4d4f"
              name="Stress"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              stroke="#b37feb"
              name="Anxiety"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#52c41a"
              name="Confidence"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Key Insights
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
            Primary Emotion: {summaryStats.primaryEmotion}
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>Peak
            Stress Level: {summaryStats.peakStress}%
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Emotional Stability: {summaryStats.emotionalStability}%
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SessionSummaryPage;
