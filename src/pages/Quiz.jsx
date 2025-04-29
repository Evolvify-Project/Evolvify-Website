import React, { useState, useEffect } from "react";
import axios from "axios";
import evolvifyLogo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import clickSoundFile from "../assets/images/sounds/button-click(chosic.com).mp3";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

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


  const clickSound = new Audio(clickSoundFile);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://evolvify.runasp.net/api/Assessments/questions"
        );
        const data = await response.json();
        console.log("API Data:", data);
        setQuestions(data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelection = (selectedChoice) => {
    clickSound.play();
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: selectedChoice.toUpperCase(), // Convert to uppercase (A, B, C, D)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      clickSound.play();
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      clickSound.play();
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    }
  };

  const handleFinish = async () => {
    clickSound.play();

    if (Object.keys(answers).length !== questions.length) {
      console.error("Not all questions have been answered.");
      return;
    }

    // Create object to store answers in the desired format
    const skills = {
      interview: {},
      communication: {},
      time_management: {},
      presentation: {},
      teamwork: {},
    };

    // Define the skill categories and their question ranges
    const skillNames = [
      "interview",
      "communication",
      "time_management",
      "presentation",
      "teamwork",
    ];

    // Assign answers to each skill category
    skillNames.forEach((skillName, skillIndex) => {
      const start = skillIndex * 6; // Start index for the skill's questions
      for (let i = 0; i < 6; i++) {
        const questionId = `Q${i + 1}`; // Question ID (Q1 to Q6)
        const answerIndex = start + i; // Corresponding answer index
        skills[skillName][questionId] = answers[answerIndex] || null; // Assign answer (A, B, C, D)
      }
    });

    console.log(
      "Skills object before sending:",
      JSON.stringify(skills, null, 2)
    );

    // Send the answers to the API
    try {
      const response = await fetch(
        "https://evolvify.runasp.net/api/Assessments/submit-answers", // Updated endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(skills),
        }
      );

      const result = await response.json();
      console.log("API result:", result);

      if (response.ok) {
        navigate("/result", { state: { scores: result.data } });
      } else {
        console.error("Error submitting answers:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const selectedAnswer = answers[currentQuestion];
  const progress =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#233A66] text-white text-2xl">
        Loading questions...
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-[#233A66] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between h-16">
        <div className="flex items-center">
          <img
            src={evolvifyLogo}
            alt="Evolvify_Logo"
            className="h-14 w-40 mr-4"
          />
        </div>
        <span className="text-xl text-[#233A66]">Hi, {username}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-xl w-full text-center mx-auto p-3 sm:p-6">
        <h1 className="text-white font-semibold text-3xl sm:text-4xl py-6">
          Welcome!
        </h1>
        <p className="text-md sm:text-lg text-white text-center pb-3">
          This assessment will help you discover your creative potential and
          identify ways to develop your skills to enhance your abilities.
        </p>

        <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col gap-5">
          {/* Progress Bar */}
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-lime-500 h-full transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute inset-0 flex justify-center items-center text-sm font-bold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Question Number */}
          <div className="text-left border border-[#233A66] px-2 py-1 shadow-xl rounded-xl text-slate-700 mt-4 font-semibold inline-block">
            Question {currentQuestion + 1} / {questions.length}
          </div>

          {/* Question */}
          <h2 className="text-xl text-[#233A66] sm:text-2xl font-semibold">
            {questions[currentQuestion]?.questionText}
          </h2>

          {/* Options */}
          <div className="space-y-5">
            {questions[currentQuestion]?.choices &&
              Object.entries(questions[currentQuestion]?.choices).map(
                ([key, option], index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelection(key)}
                    className={`cursor-pointer p-2 rounded-md border transition-all duration-300 ${
                      answers[currentQuestion] === key.toUpperCase()
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </div>
                )
              )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
            {/* Previous Buttons */}
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 bg-blue-50 text-[#1E3A5F] rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out active:scale-95"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </button>

            {/* Next Buttons */}
            <button
              onClick={handleNext}
              disabled={
                currentQuestion === questions.length - 1 ||
                !answers[currentQuestion]
              }
              className="flex items-center px-4 py-2 bg-blue-50 text-[#1E3A5F] rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out active:scale-95"
            >
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </button>

            {/* Finish Buttons */}
            <button
              onClick={handleFinish}
              disabled={Object.keys(answers).length !== questions.length}
              className={`px-6 py-2 text-white rounded-full transition-all duration-300 ease-in-out active:scale-95 ${
                Object.keys(answers).length === questions.length
                  ? "bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)]"
                  : "bg-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Quiz;
