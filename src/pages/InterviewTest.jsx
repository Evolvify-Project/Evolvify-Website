import React, { useRef, useState, useEffect } from 'react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faBrain, faMicrophone, faPlay, faStop, faSync, faUpload, faRedo, faVideo } from '@fortawesome/free-solid-svg-icons';

// Sample interview questions
const interviewQuestions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want to work here?",
  "Describe a challenging situation and how you handled it.",
  "Where do you see yourself in 5 years?"
];

const InterviewTestPage = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [frameEmotions, setFrameEmotions] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(30); // 30 seconds per question
  const [countdown, setCountdown] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    confidence: '0.0',
    anxiety: '0.0',
    stress: '0.0',
    primaryEmotion: 'neutral',
    peakStress: '0.0',
    emotionalStability: '0.0'
  });

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      if (permissionStatus.state === 'denied') {
        setError('Camera access denied. Please enable camera permissions in your browser settings.');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Camera permission check error:', err);
      setError('Error checking camera permission: ' + err.message);
      return false;
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      if (permissionStatus.state === 'denied') {
        setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Microphone permission check error:', err);
      setError('Error checking microphone permission: ' + err.message);
      return false;
    }
  };

  const startInterview = async () => {
    if (cameraActive || loading || recording) {
      console.log('Cannot start: Camera active, loading, or recording in progress');
      return;
    }

    const cameraAllowed = await checkCameraPermission();
    const micAllowed = await checkMicrophonePermission();
    if (!cameraAllowed || !micAllowed) {
      console.log('Permissions not granted:', { cameraAllowed, micAllowed });
      return;
    }

    setLoading(true);
    setError(null);
    setRecording(true);
    setCurrentQuestion(0);
    setQuestionTimer(30);
    showMessage('Interview started...');

    try {
      // Ensure DOM is fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!videoRef.current) {
        console.error('Video ref is null. DOM state:', document.querySelector('video'));
        throw new Error('Video element not found. Please refresh the page and try again.');
      }

      console.log('Accessing camera and microphone...');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Stream acquired:', stream);
      if (!stream.getVideoTracks().length || !stream.getAudioTracks().length) {
        throw new Error('No video or audio tracks available in the stream.');
      }

      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraActive(true);

      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded, playing video...');
        videoRef.current.play().catch(err => {
          console.error('Video play error:', err);
          setError('Failed to play video stream: ' + err.message);
        });
      };

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('Recording data available:', e.data.size, 'bytes');
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('MediaRecorder stopped');
        setRecording(false);
        setCountdown(null);
        setCurrentQuestion(0);
        setQuestionTimer(30);
        showMessage('Interview finished, analyzing...');
        stopCamera();
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: 'video/webm' });
          console.log('Recording blob size:', blob.size, 'bytes');
          if (blob.size > 10 * 1024 * 1024) {
            setError('Recorded video exceeds 10MB limit');
            stopCamera();
            return;
          }
          setVideoDuration(interviewQuestions.length * 30); // Total duration = questions * 30s
          uploadVideo(blob);
          chunks.length = 0;
        }
      };

      recorder.start();
      console.log('MediaRecorder started');
      let totalTimeLeft = interviewQuestions.length * 30; // Total duration
      setCountdown(totalTimeLeft);

      // Handle question switching and timer
      const questionInterval = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            setCurrentQuestion(c => {
              if (c + 1 >= interviewQuestions.length) {
                clearInterval(questionInterval);
                if (recorder.state === 'recording') {
                  recorder.stop();
                }
                return c;
              }
              return c + 1;
            });
            return 30; // Reset timer for next question
          }
          return prev - 1;
        });
        setCountdown(prev => prev - 1);
      }, 1000);

    } catch (err) {
      setError('Failed to start interview: ' + err.message);
      setRecording(false);
      setCountdown(null);
      console.error('Interview Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera... Current state:', { cameraActive, recording, cameraStream, mediaRecorder });

    if (!cameraActive && !recording) {
      console.log('Nothing to stop: Camera and recording are already off');
      return;
    }

    // Stop MediaRecorder if it exists and is recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping MediaRecorder...');
      mediaRecorder.stop();
      setMediaRecorder(null); // Clear the recorder
    }

    // Stop camera stream if it exists
    if (cameraStream) {
      console.log('Stopping camera stream...');
      cameraStream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      setCameraStream(null);
    }

    // Reset video element
    if (videoRef.current) {
      console.log('Resetting video element...');
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setCameraActive(false);
    setRecording(false);
    setCurrentQuestion(0);
    setQuestionTimer(30);
    setCountdown(null);
    showMessage('Camera stopped');
  };

  const newSession = () => {
    stopCamera();
    setEmotionData([]);
    setFrameEmotions([]);
    setVideoDuration(0);
    setSummaryStats({
      confidence: '0.0',
      anxiety: '0.0',
      stress: '0.0',
      primaryEmotion: 'neutral',
      peakStress: '0.0',
      emotionalStability: '0.0'
    });
    showMessage('Session reset');
  };

  const uploadVideo = async (videoBlob, retries = 3) => {
    setLoading(true);
    setError(null);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const formData = new FormData();
        formData.append('file', videoBlob, 'video.webm');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('https://moodydev-EvolviSense.hf.space/analyze-video/', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          if (text.includes('Your space')) {
            if (attempt < retries) {
              showMessage(`Space is sleeping, retrying... (${attempt}/${retries})`, 'warning');
              await new Promise(resolve => setTimeout(resolve, 5000));
              continue;
            } else {
              throw new Error('Server is not ready. Please try again later.');
            }
          }
          throw new Error('Invalid response from server: ' + text.slice(0, 100));
        }

        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          stress: data.mental_health.stress || 0,
          anxiety: data.mental_health.anxiety || 0,
          confidence: data.mental_health.confidence || 0,
        };

        setEmotionData((prevData) => {
          const newData = [...prevData, newDataPoint].slice(-15);
          return newData;
        });

        const totalData = [...emotionData, newDataPoint];
        const avgConfidence = totalData.reduce((sum, d) => sum + d.confidence, 0) / totalData.length || 0;
        const avgAnxiety = totalData.reduce((sum, d) => sum + d.anxiety, 0) / totalData.length || 0;
        const avgStress = totalData.reduce((sum, d) => sum + d.stress, 0) / totalData.length || 0;
        const peakStress = Math.max(...totalData.map(d => d.stress)) || 0;
        const emotionalStability = 100 - (avgStress + avgAnxiety) / 2;

        setSummaryStats({
          confidence: avgConfidence.toFixed(1),
          anxiety: avgAnxiety.toFixed(1),
          stress: avgStress.toFixed(1),
          primaryEmotion: Object.keys(data.emotions).reduce((a, b) => data.emotions[a].length > data.emotions[b].length ? a : b, 'neutral'),
          peakStress: peakStress.toFixed(1),
          emotionalStability: emotionalStability.toFixed(1),
        });

        // Process frame emotions for timeline
        const emotions = data.emotions;
        const frameCount = Object.values(emotions).reduce((sum, arr) => sum + arr.length, 0);
        const fps = 30; // Assuming 30 frames per second
        const frameEmotionData = [];
        let frameIndex = 0;

        for (const [emotion, confidences] of Object.entries(emotions)) {
          confidences.forEach((confidence) => {
            const frameTime = (frameIndex / fps).toFixed(1);
            frameEmotionData.push({
              time: parseFloat(frameTime),
              emotion: emotion,
              confidence: confidence,
            });
            frameIndex++;
          });
        }
        setFrameEmotions(frameEmotionData);

        showMessage('Analysis completed!', 'success');
        return;

      } catch (err) {
        if (attempt === retries) {
          setError('Failed to analyze video: ' + (err.name === 'AbortError' ? 'Request timed out' : err.message));
          console.error('Upload Error:', err);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Uploaded video exceeds 10MB limit');
        return;
      }
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
        uploadVideo(file);
      };
    } else {
      setError('Please select a video file');
    }
  };

  useEffect(() => {
    console.log('Component mounted, checking video element:', videoRef.current);
    if (videoRef.current) {
      console.log('Video element found on mount');
    } else {
      console.log('Video element not found on mount, waiting for DOM...');
    }
    return () => {
      console.log('Component unmounting, cleaning up...');
      stopCamera();
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-gray-700">Time: {label}s</p>
          <p className="text-gray-700">Emotion: {payload[0].payload.emotion}</p>
          <p className="text-gray-700">Confidence: {payload[0].payload.confidence}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-indigo-800">
        <FontAwesomeIcon icon={faBrain} className="text-purple-600 mr-2" />
        Interview Test
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative w-full h-64 md:h-80 rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">Camera Off</span>
              </div>
            )}
            {recording && countdown !== null && (
              <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 flex items-center">
                <FontAwesomeIcon icon={faVideo} className="mr-2 animate-pulse" />
                <span>Total: {countdown}s</span>
              </div>
            )}
            {recording && (
              <div className="absolute bottom-2 left-2 bg-blue-600 text-white rounded-lg p-2 w-full mx-2">
                <p className="font-semibold">Question {currentQuestion + 1}: {interviewQuestions[currentQuestion]}</p>
                <p>Time left: {questionTimer}s</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white animate-pulse">Loading...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={startInterview}
              disabled={cameraActive || loading || recording}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlay} className="mr-2" />
              Start Interview
            </button>
            <button
              onClick={stopCamera}
              disabled={!cameraActive && !recording}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faStop} className="mr-2" />
              Stop Interview
            </button>
            <button
              onClick={newSession}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSync} className="mr-2" />
              New Session
            </button>
            <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center cursor-pointer">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload Video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
          {message && (
            <div className={`p-2 border rounded-lg text-center ${
              message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
              message.type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
              'bg-blue-100 border-blue-400 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}
          {error && (
            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FontAwesomeIcon icon={faFaceSmile} className="text-yellow-500 mr-2" />
              Interview Performance
            </h2>
            <p className="text-gray-600">Primary Emotion: <span className="text-indigo-600 font-medium">{summaryStats.primaryEmotion}</span></p>
            <p className="text-gray-600">Confidence: <span className="text-indigo-600 font-medium">{summaryStats.confidence}%</span></p>
            <p className="text-gray-600">Emotional Stability: <span className="text-indigo-600 font-medium">{summaryStats.emotionalStability}%</span></p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FontAwesomeIcon icon={faMicrophone} className="text-green-500 mr-2" />
              Analysis Metrics
            </h2>
            <p className="text-gray-600">Stress: <span className="text-red-500 font-medium">{summaryStats.stress}%</span></p>
            <p className="text-gray-600">Anxiety: <span className="text-purple-500 font-medium">{summaryStats.anxiety}%</span></p>
            <p className="text-gray-600">Peak Stress: <span className="text-red-500 font-medium">{summaryStats.peakStress}%</span></p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Emotional Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="stress" stroke="#ff4d4f" name="Stress" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="anxiety" stroke="#b37feb" name="Anxiety" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="confidence" stroke="#52c41a" name="Confidence" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {frameEmotions.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Frame-by-Frame Emotions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                type="number"
                name="Time (s)"
                domain={[0, videoDuration]}
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                stroke="#666"
              />
              <YAxis
                dataKey="confidence"
                name="Confidence"
                domain={[0, 100]}
                label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {[...new Set(frameEmotions.map(d => d.emotion))].map((emotion, idx) => (
                <Scatter
                  key={emotion}
                  name={emotion}
                  data={frameEmotions.filter(d => d.emotion === emotion)}
                  fill={['#ff7300', '#00c49f', '#ffbb28', '#ff8042', '#8884d8', '#82ca9d', '#a4de6c'][idx % 7]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default InterviewTestPage;