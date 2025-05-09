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

// Sample interview questions
const interviewQuestions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want to work here?",
  "Describe a challenging situation and how you handled it.",
  "Where do you see yourself in 5 years?",
];

// Function to interpolate frame emotions for more data points
const interpolateFrameEmotions = (
  frameEmotions,
  videoDuration,
  pointsPerSecond = 10
) => {
  if (!frameEmotions || frameEmotions.length === 0) return [];

  const interpolatedData = [];
  const totalPoints = Math.floor(videoDuration * pointsPerSecond); // Number of points we want
  const step = videoDuration / (totalPoints - 1); // Time step between points

  for (let i = 0; i < totalPoints; i++) {
    const targetTime = i * step;

    // Find the two closest frames
    let prevFrame = frameEmotions[0];
    let nextFrame = frameEmotions[frameEmotions.length - 1];
    let found = false;

    for (let j = 0; j < frameEmotions.length - 1; j++) {
      if (
        frameEmotions[j].time <= targetTime &&
        frameEmotions[j + 1].time >= targetTime
      ) {
        prevFrame = frameEmotions[j];
        nextFrame = frameEmotions[j + 1];
        found = true;
        break;
      }
    }

    if (!found && targetTime < frameEmotions[0].time) {
      nextFrame = frameEmotions[0];
    } else if (
      !found &&
      targetTime > frameEmotions[frameEmotions.length - 1].time
    ) {
      prevFrame = frameEmotions[frameEmotions.length - 1];
    }

    // Linear interpolation for confidence
    const timeDiff = nextFrame.time - prevFrame.time;
    const weight = timeDiff > 0 ? (targetTime - prevFrame.time) / timeDiff : 0;
    const interpolatedConfidence =
      prevFrame.confidence +
      (nextFrame.confidence - prevFrame.confidence) * weight;

    // Use the emotion from the closest frame
    const emotion =
      targetTime - prevFrame.time < nextFrame.time - targetTime
        ? prevFrame.emotion
        : nextFrame.emotion;

    interpolatedData.push({
      time: targetTime,
      emotion: emotion,
      confidence: interpolatedConfidence,
    });
  }

  return interpolatedData;
};

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
    confidence: "0.0",
    anxiety: "0.0",
    stress: "0.0",
    primaryEmotion: "neutral",
    peakStress: "0.0",
    emotionalStability: "0.0",
  });
  const [uploadStatus, setUploadStatus] = useState({
    message: "",
    progress: 0,
  });
  const [isUploading, setIsUploading] = useState(false);

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

  const startInterview = async () => {
    if (cameraActive || loading || recording || isUploading) {
      console.log(
        "Cannot start: Camera active, loading, recording, or upload in progress"
      );
      return;
    }

    const cameraAllowed = await checkCameraPermission();
    const micAllowed = await checkMicrophonePermission();
    if (!cameraAllowed || !micAllowed) {
      console.log("Permissions not granted:", { cameraAllowed, micAllowed });
      return;
    }

    setLoading(true);
    setError(null);
    setRecording(true);
    setCurrentQuestion(0);
    setQuestionTimer(30);
    showMessage("Interview started...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!videoRef.current) {
        console.error(
          "Video ref is null. DOM state:",
          document.querySelector("video")
        );
        throw new Error(
          "Video element not found. Please refresh the page and try again."
        );
      }

      console.log("Accessing camera and microphone...");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Stream acquired:", stream);
      if (!stream.getVideoTracks().length || !stream.getAudioTracks().length) {
        throw new Error("No video or audio tracks available in the stream.");
      }

      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setCameraActive(true);

      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded, playing video...");
        videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
          setError("Failed to play video stream: " + err.message);
        });
      };

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000,
      });
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log("Recording data available:", e.data.size, "bytes");
          chunks.push(e.data);
        } else {
          console.log("No data available in this chunk");
        }
      };

      recorder.onstop = () => {
        console.log("MediaRecorder stopped, processing recording...");
        console.log("Total chunks recorded:", chunks.length);
        setRecording(false);
        setCountdown(null);
        setCurrentQuestion(0);
        setQuestionTimer(30);
        showMessage("Interview finished, analyzing...");

        if (chunks.length > 0) {
          console.log("Creating blob from chunks...");
          const blob = new Blob(chunks, { type: "video/webm;codecs=vp8,opus" });
          console.log("Recording blob size:", blob.size, "bytes");
          if (blob.size > 100 * 1024 * 1024) {
            setError("Recorded video exceeds 100MB limit");
            stopCamera();
            return;
          }
          if (blob.size === 0) {
            setError("Recorded video is empty. Please try again.");
            stopCamera();
            return;
          }
          stream.getTracks().forEach((track) => track.stop());
          console.log("Uploading video for analysis... Blob size:", blob.size);
          uploadVideo(blob);
          chunks.length = 0;
        } else {
          setError(
            "No recording data available to analyze. Check microphone/camera permissions."
          );
          stopCamera();
        }
      };

      recorder.start(1000);
      console.log("MediaRecorder started with timeslice of 1000ms");
      let totalTimeLeft = interviewQuestions.length * 30;
      setCountdown(totalTimeLeft);

      const questionInterval = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            setCurrentQuestion((c) => {
              if (c + 1 >= interviewQuestions.length) {
                clearInterval(questionInterval);
                if (recorder.state === "recording") {
                  console.log("All questions answered, stopping recorder...");
                  recorder.stop();
                }
                return c;
              }
              return c + 1;
            });
            return 30;
          }
          return prev - 1;
        });
        setCountdown((prev) => prev - 1);
      }, 1000);
    } catch (err) {
      setError("Failed to start interview: " + err.message);
      setRecording(false);
      setCountdown(null);
      console.error("Interview Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera... Current state:", {
      cameraActive,
      recording,
      cameraStream,
      mediaRecorder,
    });

    if (!cameraActive && !recording) {
      console.log("Nothing to stop: Camera and recording are already off");
      showMessage("Camera already stopped");
      return;
    }

    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        console.log("Stopping MediaRecorder...");
        mediaRecorder.stop();
      } else {
        console.log("MediaRecorder not recording, but stopping it anyway...");
        mediaRecorder.stop();
      }
      setMediaRecorder(null);
    }

    if (cameraStream) {
      console.log("Stopping camera stream...");
      cameraStream.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      setCameraStream(null);
    }

    if (videoRef.current) {
      console.log("Resetting video element...");
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setCameraActive(false);
    setRecording(false);
    setCurrentQuestion(0);
    setQuestionTimer(30);
    setCountdown(null);
    showMessage("Camera stopped");
  };

  const newSession = () => {
    stopCamera();
    setEmotionData([]);
    setFrameEmotions([]);
    setVideoDuration(0);
    setSummaryStats({
      confidence: "0.0",
      anxiety: "0.0",
      stress: "0.0",
      primaryEmotion: "neutral",
      peakStress: "0.0",
      emotionalStability: "0.0",
    });
    showMessage("Session reset");
  };

  const uploadVideo = async (videoBlob, retries = 3) => {
    if (isUploading) {
      console.log("Upload already in progress, ignoring new upload request");
      showMessage("An upload is already in progress. Please wait.", "warning");
      return;
    }

    setIsUploading(true);
    setLoading(true);
    setError(null);
    console.log("Starting video upload... Blob size:", videoBlob.size, "bytes");

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setUploadStatus({ message: "Uploading video...", progress: 10 });
        const formData = new FormData();
        formData.append("file", videoBlob, "video.webm");
        console.log("FormData prepared for attempt:", attempt);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("Request timed out after 5 minutes");
          controller.abort();
        }, 300000);

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

        setUploadStatus({ message: "Analyzing emotions...", progress: 50 });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.log("Non-JSON response received:", text.substring(0, 100));
          if (text.includes("Your space")) {
            if (attempt < retries) {
              setUploadStatus({
                message: `Space is sleeping, retrying... (Attempt ${attempt}/${retries})`,
                progress: 30,
              });
              console.log("Space is sleeping, waiting 5s before retry...");
              await new Promise((resolve) => setTimeout(resolve, 5000));
              continue;
            } else {
              throw new Error(
                "Server is not ready after maximum retries. Please try again later."
              );
            }
          }
          throw new Error(
            "Invalid response from server: " + text.slice(0, 100)
          );
        }

        setUploadStatus({ message: "Processing results...", progress: 80 });

        const data = await response.json();
        console.log("API response data:", data);
        if (data.error) {
          setError("API Error: " + data.error);
          console.log("API returned an error:", data.error);
          return;
        }

        // Use frame_data from backend for emotionData
        const frameData = data.frame_data.map((frame) => ({
          time: frame.time,
          stress: frame.stress,
          anxiety: frame.anxiety,
          confidence: frame.confidence,
        }));
        setEmotionData(frameData);

        // Update video duration
        setVideoDuration(data.video_duration);

        // Update summary stats with final scores and peak
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

        // Process frame emotions for timeline
        const emotions = data.emotions;
        const frameCount = Object.values(emotions).reduce(
          (sum, arr) => sum + arr.length,
          0
        );
        const frameEmotionData = [];
        let frameIndex = 0;

        for (const [emotion, confidences] of Object.entries(emotions)) {
          confidences.forEach((confidence) => {
            const frameTime =
              frameData[frameIndex]?.time ||
              frameIndex * (data.video_duration / frameCount);
            frameEmotionData.push({
              time: parseFloat(frameTime.toFixed(1)),
              emotion: emotion,
              confidence: confidence,
            });
            frameIndex++;
          });
        }
        setFrameEmotions(frameEmotionData);
        console.log("Updated frameEmotions:", frameEmotionData);

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
        }
      } finally {
        setLoading(false);
        setIsUploading(false);
      }
    }
  };

  const handleVideoUpload = (event) => {
    console.log("handleVideoUpload triggered");
    if (isUploading) {
      console.log("Upload already in progress, ignoring new upload request");
      showMessage("An upload is already in progress. Please wait.", "warning");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("Uploaded video exceeds 100MB limit");
        return;
      }
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        console.log("Uploading video file:", file.name, "Size:", file.size);
        uploadVideo(file);
      };
    } else {
      setError("Please select a video file");
    }
  };

  useEffect(() => {
    console.log("Component mounted, checking video element:", videoRef.current);
    if (videoRef.current) {
      console.log("Video element found on mount");
    } else {
      console.log("Video element not found on mount, waiting for DOM...");
    }
    return () => {
      console.log("Component unmounting, cleaning up...");
      stopCamera();
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const confidence = payload[0].payload.confidence;
      const displayConfidence =
        typeof confidence === "number" && !isNaN(confidence)
          ? confidence.toFixed(1)
          : "N/A";
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">
            Time: {typeof label === "number" ? label.toFixed(1) : "N/A"}s
          </p>
          <p className="text-gray-700">
            Emotion:{" "}
            <span className="font-medium text-indigo-600">
              {payload[0].payload.emotion || "Unknown"}
            </span>
          </p>
          <p className="text-gray-700">
            Confidence:{" "}
            <span className="font-medium text-green-600">
              {displayConfidence}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

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

  // Interpolate frame emotions for more data points
  const interpolatedFrameEmotions = interpolateFrameEmotions(
    frameEmotions,
    videoDuration
  );

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
                <span>Total: {countdown}s</span>
              </div>
            )}
            {recording && (
              <div className="absolute bottom-2 left-2 bg-blue-600 text-white rounded-lg p-2 w-full mx-2">
                <p className="font-semibold">
                  Question {currentQuestion + 1}:{" "}
                  {interviewQuestions[currentQuestion]}
                </p>
                <p>Time left: {questionTimer}s</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col">
                <span className="text-white animate-pulse mb-2">
                  {uploadStatus.message}
                </span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={startInterview}
              disabled={cameraActive || loading || recording || isUploading}
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
                disabled={isUploading}
              />
            </label>
          </div>
          {message && (
            <div
              className={`p-2 border rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : message.type === "warning"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : message.type === "error"
                  ? "bg-red-100 border-red-400 text-red-700"
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
              Interview Performance
            </h2>
            <p className="text-gray-600">
              Primary Emotion:{" "}
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
            <p className="text-gray-600">
              Emotional Stability:{" "}
              <span className="text-indigo-600 font-medium">
                {summaryStats.emotionalStability}%
              </span>
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FontAwesomeIcon
                icon={faMicrophone}
                className="text-green-500 mr-2"
              />
              Analysis Metrics
            </h2>
            <p className="text-gray-600">
              Stress:{" "}
              <span className="text-red-500 font-medium">
                {summaryStats.stress}%
              </span>
            </p>
            <p className="text-gray-600">
              Anxiety:{" "}
              <span className="text-purple-500 font-medium">
                {summaryStats.anxiety}%
              </span>
            </p>
            <p className="text-gray-600">
              Peak Stress:{" "}
              <span className="text-red-500 font-medium">
                {summaryStats.peakStress}%
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Emotional Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={emotionData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, videoDuration]}
              tickCount={Math.ceil(videoDuration / 5) + 1}
              interval={0}
              label={{
                value: "Time (seconds)",
                position: "insideBottom",
                offset: -5,
              }}
              stroke="#666"
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              domain={[0, 100]}
              tickCount={11}
              label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
              stroke="#666"
            />
            <Tooltip content={<LineChartTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#ff4d4f"
              name="Stress"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              stroke="#b37feb"
              name="Anxiety"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#52c41a"
              name="Confidence"
              strokeWidth={3}
              dot={false}
            />
            {summaryStats.peakStress && (
              <Line
                type="monotone"
                data={[
                  { time: 0, stress: summaryStats.peakStress },
                  { time: videoDuration, stress: summaryStats.peakStress },
                ]}
                stroke="#ff0000"
                name="Peak Stress"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {interpolatedFrameEmotions.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">
            Frame-by-Frame Emotions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                type="number"
                name="Time (s)"
                domain={[0, videoDuration]}
                tickCount={Math.ceil(videoDuration / 5) + 1}
                interval={0}
                label={{
                  value: "Time (seconds)",
                  position: "insideBottom",
                  offset: -5,
                }}
                stroke="#666"
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis
                dataKey="confidence"
                name="Confidence"
                domain={[0, 100]}
                tickCount={11}
                label={{
                  value: "Confidence (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {[
                ...new Set(interpolatedFrameEmotions.map((d) => d.emotion)),
              ].map((emotion, idx) => (
                <Scatter
                  key={emotion}
                  name={emotion}
                  data={interpolatedFrameEmotions.filter(
                    (d) => d.emotion === emotion
                  )}
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
                  shape={
                    [
                      "circle",
                      "triangle",
                      "square",
                      "diamond",
                      "star",
                      "cross",
                      "wye",
                    ][idx % 7]
                  }
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
