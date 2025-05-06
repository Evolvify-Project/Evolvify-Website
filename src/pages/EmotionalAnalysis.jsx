import React, { useRef, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faBrain,
  faMicrophone,
  faPlay,
  faStop,
  faSync,
  faUpload,
  faRedo,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useEmotion } from "./EmotionContext";

const EmotionAnalysisPage = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState(null);
  const {
    emotionData,
    setEmotionData,
    summaryStats,
    setSummaryStats,
    error,
    setError,
    resetSession,
  } = useEmotion();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [analysisActive, setAnalysisActive] = useState(false);
  const [initialAnalysisTime, setInitialAnalysisTime] = useState(0);
  const [recordDuration, setRecordDuration] = useState(5);
  const [voiceAnalysisActive, setVoiceAnalysisActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [frameEmotions, setFrameEmotions] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "camera",
      });
      if (permissionStatus.state === "denied") {
        setError(
          "Camera access denied. Please enable camera permissions in your browser settings."
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error("Permission check error:", err);
      return true;
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });
      if (permissionStatus.state === "denied") {
        setError(
          "Microphone access denied. Please enable microphone permissions in your browser settings."
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error("Permission check error:", err);
      return true;
    }
  };

  const startCamera = async () => {
    if (cameraActive || loading || recording) return;

    const cameraAllowed = await checkCameraPermission();
    const micAllowed = await checkMicrophonePermission();
    if (!cameraAllowed || !micAllowed) return;

    setLoading(true);
    setError(null);
    setRecording(true);
    showMessage("Recording started...");

    try {
      if (!videoRef.current) {
        throw new Error(
          "Video element not found. Please refresh the page and try again."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Stream acquired:", stream);
      console.log("Video tracks:", stream.getVideoTracks());
      console.log("Audio tracks:", stream.getAudioTracks());

      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraActive(true);
      setAnalysisActive(true);
      setVoiceAnalysisActive(true);

      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded, attempting to play");
        videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
          setError("Failed to play video stream: " + err.message);
        });
      };

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecording(false);
        setCountdown(null);
        showMessage("Recording finished, analyzing...");
        stopCamera(); // Automatically stop the camera when recording stops
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: "video/webm" });
          if (blob.size > 10 * 1024 * 1024) {
            setError("Recorded video exceeds 10MB limit");
            stopCamera();
            return;
          }
          setVideoDuration(recordDuration);
          uploadVideo(blob);
          chunks.length = 0;
        }
      };

      recorder.start();
      console.log("MediaRecorder started");
      let timeLeft = recordDuration;
      setCountdown(timeLeft);
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }
      }, 1000);
    } catch (err) {
      setError("Failed to start camera: " + err.message);
      setRecording(false);
      setCountdown(null);
      console.error("Camera Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (!cameraActive && !recording) return;

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      console.log("MediaRecorder stopped");
    }

    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log(`Track ${track.kind} stopped`);
      });
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setCameraActive(false);
    setAnalysisActive(false);
    setRecording(false);
    setVoiceAnalysisActive(false);
    setInitialAnalysisTime(0);
    setCountdown(null);
    showMessage("Camera stopped");
  };

  const newSession = () => {
    stopCamera();
    resetSession();
    setFrameEmotions([]);
    setVideoDuration(0);
    showMessage("Session reset");
  };

  const analyzeAgain = () => {
    if (cameraActive) {
      startCamera();
    } else {
      setError("Please start the camera first");
    }
  };

  const uploadVideo = async (videoBlob, retries = 3) => {
    setLoading(true);
    setError(null);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const formData = new FormData();
        formData.append("file", videoBlob, "video.webm");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
          "https://moodydev-EvolviSense.hf.space/analyze-video/",
          {
            method: "POST",
            body: formData,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          if (text.includes("Your space")) {
            if (attempt < retries) {
              showMessage(
                `Space is sleeping, retrying... (${attempt}/${retries})`,
                "warning"
              );
              await new Promise((resolve) => setTimeout(resolve, 5000));
              continue;
            } else {
              throw new Error("Server is not ready. Please try again later.");
            }
          }
          throw new Error(
            "Invalid response from server: " + text.slice(0, 100)
          );
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
        const avgConfidence =
          totalData.reduce((sum, d) => sum + d.confidence, 0) /
            totalData.length || 0;
        const avgAnxiety =
          totalData.reduce((sum, d) => sum + d.anxiety, 0) / totalData.length ||
          0;
        const avgStress =
          totalData.reduce((sum, d) => sum + d.stress, 0) / totalData.length ||
          0;
        const peakStress = Math.max(...totalData.map((d) => d.stress)) || 0;
        const emotionalStability = 100 - (avgStress + avgAnxiety) / 2;

        setSummaryStats({
          confidence: avgConfidence.toFixed(1),
          anxiety: avgAnxiety.toFixed(1),
          stress: avgStress.toFixed(1),
          primaryEmotion: Object.keys(data.emotions).reduce(
            (a, b) => (data.emotions[a] > data.emotions[b] ? a : b),
            "neutral"
          ),
          peakStress: peakStress.toFixed(1),
          emotionalStability: emotionalStability.toFixed(1),
        });

        // Process frame emotions for timeline with better time distribution
        const emotions = data.emotions;
        const frameCount = Object.values(emotions).reduce(
          (sum, arr) => sum + arr.length,
          0
        );
        const fps = 30; // Assuming 30 frames per second as default
        const frameEmotionData = [];

        let frameIndex = 0;
        for (const [emotion, confidences] of Object.entries(emotions)) {
          confidences.forEach((confidence, idx) => {
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

        setInitialAnalysisTime((prev) => Math.min(prev + recordDuration, 120));
        showMessage("Analysis completed!", "success");
        return;
      } catch (err) {
        if (attempt === retries) {
          setError(
            "Failed to analyze video: " +
              (err.name === "AbortError" ? "Request timed out" : err.message)
          );
          console.error("Upload Error:", err);
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
        setError("Uploaded video exceeds 10MB limit");
        return;
      }
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
        uploadVideo(file);
      };
    } else {
      setError("Please select a video file");
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-gray-700">Time: {label}s</p>
          <p className="text-gray-700">Emotion: {payload[0].payload.emotion}</p>
          <p className="text-gray-700">
            Confidence: {payload[0].payload.confidence}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-indigo-800">
        <FontAwesomeIcon icon={faBrain} className="text-purple-600 mr-2" />
        Emotion Analysis
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
              style={{ display: cameraActive ? "block" : "none" }}
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">Camera Off</span>
              </div>
            )}
            {recording && countdown !== null && (
              <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 flex items-center">
                <FontAwesomeIcon
                  icon={faVideo}
                  className="mr-2 animate-pulse"
                />
                <span>{countdown}s</span>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white animate-pulse">Loading...</span>
              </div>
            )}
            {cameraActive && !recording && (
              <div className="absolute bottom-2 left-2 bg-green-600 text-white rounded-full p-2">
                <FontAwesomeIcon icon={faVideo} className="animate-pulse" />
                <span className="ml-2">Camera Active</span>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={startCamera}
              disabled={cameraActive || loading || recording}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlay} className="mr-2" />
              Start Camera
            </button>
            <button
              onClick={stopCamera}
              disabled={!cameraActive && !recording}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faStop} className="mr-2" />
              Stop Camera
            </button>
            <button
              onClick={analyzeAgain}
              disabled={loading || recording}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 transition duration-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faRedo} className="mr-2" />
              Analyze Again
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
          <div className="flex items-center space-x-2">
            <label className="text-gray-600">Record Duration (seconds):</label>
            <select
              value={recordDuration}
              onChange={(e) => setRecordDuration(Number(e.target.value))}
              className="p-1 border rounded-lg"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
          {message && (
            <div
              className={`p-2 border rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : message.type === "warning"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-blue-100 border-blue-400 text-blue-700"
              }`}
            >
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
              <FontAwesomeIcon
                icon={faFaceSmile}
                className="text-yellow-500 mr-2"
              />
              Emotional State
            </h2>
            <p className="text-gray-600">
              Primary:{" "}
              <span className="text-indigo-600 font-medium">
                {summaryStats.primaryEmotion}
              </span>
            </p>
            <p className="text-gray-600">
              Confidence:{" "}
              <span className="text-indigo-600 font-medium">
                {summaryStats.confidence}%
              </span>
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FontAwesomeIcon
                icon={faMicrophone}
                className="text-green-500 mr-2"
              />
              Analysis State
            </h2>
            <p className="text-gray-600">
              Face Analysis:{" "}
              <span className="text-green-500 font-medium">
                {analysisActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-gray-600">
              Voice Analysis:{" "}
              <span className="text-green-500 font-medium">
                {voiceAnalysisActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-gray-600">
              Initial Analysis:{" "}
              <span className="text-blue-600 font-medium">
                {initialAnalysisTime}s
              </span>{" "}
              / <span className="text-gray-500">120s</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-slate-50 p-4 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Emotional Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emotionData}>
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
      {frameEmotions.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">
            Frame-by-Frame Emotions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                type="number"
                name="Time (s)"
                domain={[0, videoDuration]}
                label={{
                  value: "Time (seconds)",
                  position: "insideBottom",
                  offset: -5,
                }}
                stroke="#666"
              />
              <YAxis
                dataKey="confidence"
                name="Confidence"
                domain={[0, 100]}
                label={{
                  value: "Confidence (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {[...new Set(frameEmotions.map((d) => d.emotion))].map(
                (emotion, idx) => (
                  <Scatter
                    key={emotion}
                    name={emotion}
                    data={frameEmotions.filter((d) => d.emotion === emotion)}
                    fill={
                      [
                        "#ff7300",
                        "#00c49f",
                        "#ffbb28",
                        "#ff8042",
                        "#8884d8",
                        "#82ca9d",
                        "#a4de6c",
                      ][idx % 7]
                    }
                  />
                )
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="text-right mt-4">
        <Link
          to="/summary"
          className="text-indigo-600 hover:text-indigo-800 transition"
        >
          <button className="px-6 py-2 bg-gradient-to-r from-indigo-900 to-blue-600 rounded-full text-white hover:opacity-90 transition duration-200">
            View Session Summary →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmotionAnalysisPage;
