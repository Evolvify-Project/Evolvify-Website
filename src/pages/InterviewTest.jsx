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
import EvolviSense from "./EvolviSense";

const interviewQuestions = [
  "Tell us about yourself.",
  "What are your strengths?",
  "What are your weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in 5 years?",
];

const totalQuestions = interviewQuestions.length;
const QUESTION_DURATION = 30; // Duration per question in seconds

const InterviewTestPage = () => (
  <EvolviSense
    prompts={interviewQuestions}
    testTypeLabel="Interview"
    testTypeHeading="Interview Test"
    promptLabel="Question"
    promptSingular="Question"
    durationPerPrompt={QUESTION_DURATION}
  />
);

export default InterviewTestPage;
