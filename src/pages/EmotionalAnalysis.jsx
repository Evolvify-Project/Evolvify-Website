import React, { useRef, useState, useEffect } from "react";
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
  faVideo,
  faQuestionCircle,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useEmotion } from "./EmotionContext";

const presentationTopics = [
  "Introduce Your Topic.",
  "Explain Your Key Points.",
  "Discuss Potential Challenges.",
  "Share Your Solution or Approach.",
  "Conclude with Your Vision.",
];

const totalTopics = presentationTopics.length;
const TOPIC_DURATION = 30; // Duration per topic in seconds

const PresentationTestPage = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [topicTimer, setTopicTimer] = useState(TOPIC_DURATION);
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    progress: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isRecordingFinished, setIsRecordingFinished] = useState(false);
  const {
    emotionData,
    setEmotionData,
    summaryStats,
    setSummaryStats,
    resetSession,
  } = useEmotion();

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
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
      console.error("Camera permission check error:", err);
      setError("Error checking camera permission: " + err.message);
      return false;
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
      console.error("Microphone permission check error:", err);
      setError("Error checking microphone permission: " + err.message);
      return false;
    }
  };

  // UseEffect to handle the topic timer and synchronize countdown
  useEffect(() => {
    if (!recording) return;

    const interval = setInterval(() => {
      setTopicTimer((prev) => {
        if (prev <= 0) {
          const nextTopic = currentTopic + 1;
          if (nextTopic < presentationTopics.length) {
            setCurrentTopic(nextTopic);
            return TOPIC_DURATION; // Reset timer for the next topic
          } else {
            // Reached the last topic, stop the recording
            if (mediaRecorder?.state === "recording") {
              mediaRecorder.stop();
            }
            return 0;
          }
        }
        return prev - 1;
      });

      // Calculate total remaining time based on current topic and topicTimer
      setCountdown(() => {
        const remainingTopics = totalTopics - currentTopic - 1;
        const remainingTime = remainingTopics * TOPIC_DURATION + topicTimer;
        return remainingTime > 0 ? remainingTime : 0;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or when recording stops
  }, [recording, currentTopic, mediaRecorder, topicTimer, totalTopics]);

  const startPresentation = async () => {
    if (cameraActive || loading || recording || isUploading) return;

    const cameraAllowed = await checkCameraPermission();
    const micAllowed = await checkMicrophonePermission();
    if (!cameraAllowed || !micAllowed) return;

    setLoading(true);
    setError(null);
    setRecording(true);
    setCurrentTopic(0);
    setTopicTimer(TOPIC_DURATION);
    setIsRecordingFinished(false);
    showMessage("Presentation started...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!videoRef.current) {
        throw new Error(
          "Video element not found. Please refresh the page and try again."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });
      console.log("Stream acquired:", stream);

      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraActive(true);

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
          setError("Failed to play video stream: " + err.message);
        });
      };

      let mimeType = "video/mp4";
      const mimeTypes = [
        "video/mp4;codecs=h264,aac",
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
      ];
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log("Selected MIME type:", mimeType);
          break;
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
      });
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecording(false);
        setCountdown(null);
        setCurrentTopic(0);
        setTopicTimer(TOPIC_DURATION);
        showMessage("Presentation finished. Please submit or cancel.");
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: mimeType });
          if (blob.size > 100 * 1024 * 1024) {
            setError("Recorded video exceeds 100MB limit");
            return;
          }
          setRecordedBlob(blob);
          setRecordedVideoUrl(URL.createObjectURL(blob));
          setVideoDuration(totalTopics * TOPIC_DURATION);
          setIsRecordingFinished(true);
          chunks.length = 0;
        }
      };

      recorder.start(100);
      console.log("MediaRecorder started with timeslice of 100ms");

      setCountdown(totalTopics * TOPIC_DURATION);
    } catch (err) {
      setError("Failed to start presentation: " + err.message);
      setRecording(false);
      setCountdown(null);
      console.error("Presentation Error:", err);
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
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setCameraActive(false);
    setRecording(false);
    setCountdown(null);
    setCurrentTopic(0);
    setTopicTimer(TOPIC_DURATION);
    setIsRecordingFinished(false);
    showMessage("Camera stopped");
  };

  const cancelRecording = () => {
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    stopCamera();
    setUploadStatus({ message: "", progress: 0 });
    setIsRecordingFinished(false);
    showMessage("Recording cancelled");
  };

  const newSession = () => {
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    stopCamera();
    resetSession();
    setVideoDuration(0);
    setUploadStatus({ message: "", progress: 0 });
    setIsRecordingFinished(false);
    showMessage("Session reset");
  };

  const submitVideo = async () => {
    if (!recordedBlob) {
      setError("No video to submit");
      return;
    }
    setLoading(true);
    setUploadStatus({ message: "Processing video...", progress: 10 });
    try {
      await uploadVideo(recordedBlob);
    } catch (err) {
      setError("Failed to process video: " + err.message);
    } finally {
      setLoading(false);
      setIsRecordingFinished(false);
    }
  };

  const uploadVideo = async (videoBlob, retries = 3) => {
    if (isUploading) {
      showMessage("An upload is already in progress. Please wait.", "warning");
      return;
    }

    setIsUploading(true);
    setLoading(true);
    setError(null);
    console.log("Starting video upload... Blob size:", videoBlob.size, "bytes");

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setUploadStatus({ message: "Processing video...", progress: 10 });

        setUploadStatus({ message: "Uploading video...", progress: 30 });
        const formData = new FormData();
        formData.append("file", videoBlob, "video.mp4");
        console.log("FormData prepared for attempt:", attempt);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);

        const response = await fetch(
          "https://moodydev-EvolviSense.hf.space/analyze-video/",
          {
            method: "POST",
            body: formData,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        console.log(
          "API response received - Status:",
          response.status,
          "Status Text:",
          response.statusText
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setUploadStatus({ message: "Analyzing emotions...", progress: 50 });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          if (text.includes("Your space")) {
            if (attempt < retries) {
              setUploadStatus({
                message: `Space is sleeping, retrying... (Attempt ${attempt}/${retries})`,
                progress: 30,
              });
              await new Promise((resolve) => setTimeout(resolve, 5000));
              continue;
            } else {
              throw new Error("Server is not ready. Please try again later.");
            }
          }
          throw new Error(
            "Invalid response format from server: " + text.slice(0, 100)
          );
        }

        setUploadStatus({ message: "Processing results...", progress: 80 });

        const data = await response.json();
        console.log("API response data:", data);
        if (data.error) {
          throw new Error("API Error: " + data.error);
        }

        const frameData = data.frame_data.map((frame, index) => ({
          time: parseFloat(
            (index / data.frame_data.length) * data.video_duration.toFixed(2)
          ),
          stress: frame.stress,
          anxiety: frame.anxiety,
          confidence: frame.confidence,
        }));

        const interpolatedData = [];
        for (let i = 0; i < frameData.length - 1; i++) {
          interpolatedData.push(frameData[i]);
          if (i < frameData.length - 1) {
            const nextFrame = frameData[i + 1];
            const currentFrame = frameData[i];
            const midTime = (currentFrame.time + nextFrame.time) / 2;
            interpolatedData.push({
              time: parseFloat(midTime.toFixed(2)),
              stress: (currentFrame.stress + nextFrame.stress) / 2,
              anxiety: (currentFrame.anxiety + nextFrame.anxiety) / 2,
              confidence: (currentFrame.confidence + nextFrame.confidence) / 2,
            });
          }
        }
        if (frameData.length > 0)
          interpolatedData.push(frameData[frameData.length - 1]);
        if (
          interpolatedData.length === 0 ||
          interpolatedData[interpolatedData.length - 1].time <
            data.video_duration
        ) {
          const last =
            interpolatedData[interpolatedData.length - 1] ||
            frameData[frameData.length - 1];
          interpolatedData.push({ ...last, time: data.video_duration });
        }
        setEmotionData(interpolatedData);

        setSummaryStats((prevStats) => ({
          ...prevStats,
          confidence: data.mental_health.confidence.toFixed(1),
          anxiety: data.mental_health.anxiety.toFixed(1),
          stress: data.mental_health.stress.toFixed(1),
          primaryEmotion: Object.keys(data.emotions).reduce(
            (a, b) =>
              data.emotions[a].length > data.emotions[b].length ? a : b,
            "neutral"
          ),
          peakStress: data.peak_stress.toFixed(1),
          emotionalStability: (
            100 -
            (data.mental_health.stress + data.mental_health.anxiety) / 2
          ).toFixed(1),
        }));

        setUploadStatus({ message: "Analysis completed!", progress: 100 });
        showMessage("Analysis completed successfully!", "success");
        return;
      } catch (err) {
        console.error("Upload attempt", attempt, "failed:", err.message);
        if (attempt === retries) {
          setError(
            `Failed to analyze video after ${retries} attempts: ${
              err.name === "AbortError"
                ? "Request timed out after 5 minutes"
                : err.message
            }. Please check your internet connection or try again later.`
          );
          showMessage(
            `Upload failed: ${err.message}. Retrying didn't work.`,
            "error"
          );
          setUploadStatus({ message: "Analysis failed.", progress: 0 });
        } else {
          setUploadStatus({
            message: `Retry ${attempt + 1} of ${retries}...`,
            progress: 30,
          });
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } finally {
        setLoading(false);
        setIsUploading(false);
      }
    }
  };

  const handleVideoUpload = (event) => {
    if (isUploading) {
      showMessage("An upload is already in progress. Please wait.", "warning");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("Uploaded video exceeds 100MB limit");
        return;
      }
      setRecordedBlob(file);
      setRecordedVideoUrl(URL.createObjectURL(file));
      setVideoDuration(file.duration || 0);
      setIsRecordingFinished(true);
      showMessage("Video uploaded. Please submit or cancel.", "success");
    } else {
      setError("Please select a video file");
    }
  };

  useEffect(() => {
    return () => {
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
      stopCamera();
    };
  }, [recordedVideoUrl]);

  const LineChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">
            Time: {label.toFixed(1)}s
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-700">
              {entry.name}:{" "}
              <span className="font-medium" style={{ color: entry.stroke }}>
                {typeof entry.value === "number" && !isNaN(entry.value)
                  ? entry.value.toFixed(1)
                  : "N/A"}
                %
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-gray-800 font-sans">
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
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
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-indigo-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        <FontAwesomeIcon icon={faBrain} className="mr-3 text-purple-500" />
        Presentation Test
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="relative w-full rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl bg-white">
            {recordedVideoUrl ? (
              <video
                ref={videoRef}
                src={recordedVideoUrl}
                controls
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[400px] object-cover rounded-2xl"
                  style={{ display: cameraActive ? "block" : "none" }}
                />
                {!cameraActive && (
                  <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 rounded-2xl">
                    <span className="text-gray-500 text-lg">Camera Off</span>
                  </div>
                )}
                {recording && countdown !== null && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 flex items-center animate-pulse">
                    <FontAwesomeIcon icon={faVideo} className="mr-2" />
                    <span>{countdown}s</span>
                  </div>
                )}
              </>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center flex-col rounded-2xl">
                <span className="text-white text-lg animate-pulse mb-2">
                  {uploadStatus.message}
                </span>
                <div className="w-3/4 bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          {recording && (
            <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 transition-all duration-500 transform animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="mr-2 text-blue-500"
                  />
                  <h3 className="font-semibold text-lg text-gray-800">
                    Current Topic (Question {currentTopic + 1} of {totalTopics})
                  </h3>
                </div>
                <span className="text-sm text-gray-500">{topicTimer}s</span>
              </div>
              <p className="text-gray-700 mb-4">
                {presentationTopics[currentTopic]}
              </p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(topicTimer / TOPIC_DURATION) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          {isRecordingFinished && !loading && (
            <div className="flex justify-between mt-4 space-x-4">
              <button
                onClick={submitVideo}
                disabled={loading || isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Submit
              </button>
              <button
                onClick={cancelRecording}
                disabled={loading || isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
          {(!isRecordingFinished || loading) && (
            <div className="flex justify-between mt-4 space-x-4">
              <button
                onClick={startPresentation}
                disabled={cameraActive || loading || recording || isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Start
              </button>
              <button
                onClick={stopCamera}
                disabled={!cameraActive && !recording}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faStop} className="mr-2" />
                Stop
              </button>
              <button
                onClick={newSession}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faSync} className="mr-2" />
                Reset
              </button>
              <label className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-200 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Upload
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-700">
              <FontAwesomeIcon
                icon={faFaceSmile}
                className="mr-2 text-yellow-500"
              />
              Emotional State
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Primary Emotion:{" "}
                <span className="text-indigo-600 font-medium">
                  {summaryStats.primaryEmotion}
                </span>
              </p>
              <p>
                Confidence:{" "}
                <span className="text-indigo-600 font-medium">
                  {summaryStats.confidence}%
                </span>
              </p>
              <p>
                Emotional Stability:{" "}
                <span className="text-indigo-600 font-medium">
                  {summaryStats.emotionalStability}%
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-700">
              <FontAwesomeIcon
                icon={faMicrophone}
                className="mr-2 text-green-500"
              />
              Metrics
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Stress:{" "}
                <span className="text-red-500 font-medium">
                  {summaryStats.stress}%
                </span>
              </p>
              <p>
                Anxiety:{" "}
                <span className="text-purple-500 font-medium">
                  {summaryStats.anxiety}%
                </span>
              </p>
              <p>
                Peak Stress:{" "}
                <span className="text-red-500 font-medium">
                  {summaryStats.peakStress}%
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Confidence
              </h3>
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
              <LineChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  content={<LineChartTooltip />}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #ddd",
                  }}
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
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Peak Stress Level: {summaryStats.peakStress}%
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Emotional Stability: {summaryStats.emotionalStability}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationTestPage;
