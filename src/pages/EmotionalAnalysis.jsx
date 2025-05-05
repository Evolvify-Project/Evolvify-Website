
import React, { useRef, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faBrain, faMicrophone, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

const emotionData = [
  { time: '02:12:36 AM', stress: 1, anxiety: 4, confidence: 20 },
  { time: '02:12:40 AM', stress: 2, anxiety: 5, confidence: 30 },
  { time: '02:12:45 AM', stress: 1.5, anxiety: 6, confidence: 40 },
  { time: '02:12:50 AM', stress: 1.2, anxiety: 5.5, confidence: 35 },
  { time: '02:12:55 AM', stress: 1.8, anxiety: 4.8, confidence: 45 },
];

const EmotionAnalysisPage = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    if (cameraActive) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        <FontAwesomeIcon icon={faBrain} className="text-purple-500 mr-2" />
        Real-time Emotion Analysis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="relative w-full h-80 rounded-xl border overflow-hidden">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline title="Live Camera Feed" className="w-full h-full object-cover" />
            ) : (
              <img
                src="../assets/images/camera-placeholder.png"
                alt="User Video"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlay} className="mr-2" />
              Start Camera
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <FontAwesomeIcon icon={faStop} className="mr-2" />
              Stop Camera
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <h2 className="font-semibold">
              <FontAwesomeIcon icon={faFaceSmile} className="text-yellow-500 mr-2" />
              Emotional state
            </h2>
            <p>Primary: <span className="text-purple-500 font-medium">neutral</span></p>
            <p>Confidence: <span className="text-purple-500 font-medium">21.3%</span></p>
          </div>
          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <h2 className="font-semibold">
              <FontAwesomeIcon icon={faMicrophone} className="text-green-500 mr-2" />
              Analysis state
            </h2>
            <p>Face Analysis: <span className="text-green-500 font-medium">Active</span></p>
            <p>Voice Analysis: <span className="text-green-500 font-medium">Active</span></p>
            <p>Initial analysis: <span className="text-blue-600 font-medium">36s</span> / <span className="text-gray-500">120s</span></p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-2">Emotional Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emotionData}>
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
      <div className="text-right">
   <Link to="/summary" className="text-blue-600 underline"><button className='pl-5 pr-5 h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white hover:opacity-90 transition'>View Session Summary →</button></Link>
      </div>
    </div>
  );
};

export default EmotionAnalysisPage;
