import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const sessionData = [
  { time: '02:12:36 AM', stress: 1, anxiety: 4, confidence: 20 },
  { time: '02:12:40 AM', stress: 2, anxiety: 5, confidence: 30 },
  { time: '02:12:45 AM', stress: 1.5, anxiety: 6, confidence: 40 },
  { time: '02:12:50 AM', stress: 1.2, anxiety: 5.5, confidence: 35 },
  { time: '02:12:55 AM', stress: 1.8, anxiety: 4.8, confidence: 45 },
];

const SessionSummaryPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">Session summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Confidence</h3>
          <p className="text-green-500 text-xl">25.5%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Anxiety</h3>
          <p className="text-purple-500 text-xl">5.3%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Stress</h3>
          <p className="text-red-500 text-xl">1.5%</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sessionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stress" stroke="#ff4d4f" name="Stress" />
            <Line type="monotone" dataKey="anxiety" stroke="#b37feb" name="Anxiety" />
            <Line type="monotone" dataKey="confidence" stroke="#52c41a" name="Confidence" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-100 p-4 rounded-xl shadow-sm ">
        <h3 className="font-semibold text-2xl ">Key Insights</h3>
        <ul className="mt-2 space-y-1">
          <li>Primary emotional: neutral</li>
          <li>Peak stress level: 3.6%</li>
          <li>Emotional stability: 97.0%</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionSummaryPage;