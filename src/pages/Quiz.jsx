import React, { useState, useEffect } from "react";
import axios from "axios";
import evolvifyLogo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
// import clickSoundFile from "../assets/sounds/button-click(chosic.com).mp3";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false); // State لحالة الـ quiz المكتمل
  const [errorMessage, setErrorMessage] = useState(null); // State لرسايل الإيرور
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("username") || "Anonymous";

  // Axios interceptor for Authorization header
  axios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // const clickSound = new Audio(clickSoundFile);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://evolvify.runasp.net/api/Assessments/questions"
        );
        console.log("Questions API Data:", response.data);

        // Check if the assessment is already completed
        if (!response.data.success && response.data.message === "Assessment already completed.") {
          setIsCompleted(true); // فعّل حالة الـ quiz المكتمل
          return;
        }

        // Validate that response.data.data is an array
        if (Array.isArray(response.data.data)) {
          setQuestions(response.data.data);
        } else {
          console.error("Expected an array in response.data.data, got:", response.data.data);
          setQuestions([]);
          setErrorMessage("Invalid questions data received.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
        setErrorMessage("An error occurred while fetching questions.");
      }
    };

    fetchQuestions();
  }, []);

  const handleViewResults = async () => {
    try {
      const resultResponse = await axios.get(
        "https://evolvify.runasp.net/api/Assessments/Result"
      );
      console.log("Results API Data:", resultResponse.data);

      if (resultResponse.data.success && resultResponse.data.data) {
        // انقل اليوزر لصفحة الـ results مع الداتا
        navigate("/result", { state: { scores: resultResponse.data.data } });
      } else {
        setErrorMessage("No results available. Please contact support.");
      }
    } catch (resultError) {
      console.error("Error fetching results:", resultError);
      setErrorMessage("Failed to fetch results. Please try again later.");
    }
  };

  const handleAnswerSelection = (selectedChoice) => {
    // clickSound.play();
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: selectedChoice.toUpperCase(),
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      // clickSound.play();
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // clickSound.play();
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    }
  };

  const handleFinish = async () => {
    // clickSound.play();

    if (Object.keys(answers).length !== questions.length) {
      console.error("Not all questions have been answered.");
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }

    const skills = {
      interview: {},
      communication: {},
      time_management: {},
      presentation: {},
      teamwork: {},
    };

    const skillNames = [
      "interview",
      "communication",
      "time_management",
      "presentation",
      "teamwork",
    ];

    skillNames.forEach((skillName, skillIndex) => {
      const start = skillIndex * 6;
      for (let i = 0; i < 6; i++) {
        const questionId = `Q${i + 1}`;
        const answerIndex = start + i;
        skills[skillName][questionId] = answers[answerIndex] || null;
      }
    });

    console.log(
      "Skills object before sending:",
      JSON.stringify(skills, null, 2)
    );

    try {
      const response = await axios.post(
        "https://evolvify.runasp.net/api/Assessments/submit-answers",
        skills
      );

      console.log("Submit API result:", response.data);

      if (response.data.success) {
        navigate("/result", { state: { scores: response.data.data } });
      } else {
        console.error("Error submitting answers:", response.data);
        setErrorMessage("Failed to submit answers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      setErrorMessage("An error occurred while submitting answers.");
    }
  };

  const selectedAnswer = answers[currentQuestion];
  const progress =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // إذا الـ quiz مكتمل
  if (isCompleted) {
    return (
      <section className="min-h-screen w-full bg-[#233A66] flex flex-col">
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
        <div className="max-w-xl w-full text-center mx-auto p-3 sm:p-6">
          <h1 className="text-white font-semibold text-3xl sm:text-4xl py-6">
            Assessment Completed
          </h1>
          <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col gap-5">
            <p className="text-lg text-[#233A66] font-semibold">
              You have already completed this assessment.
            </p>
            <p className="text-md text-[#233A66]">
              Click below to view your results.
            </p>
            <button
              onClick={handleViewResults}
              className="px-6 py-2 bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] text-white rounded-full hover:bg-[linear-gradient(to_right,#5AA0E6,#17304D)] transition-all duration-300 ease-in-out active:scale-95"
            >
              View Results
            </button>
            {errorMessage && (
              <p className="text-red-500 text-md">{errorMessage}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // إذا فيه رسالة إيرور
  if (errorMessage) {
    return (
      <section className="min-h-screen w-full bg-[#233A66] flex flex-col">
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
        <div className="flex justify-center items-center h-screen bg-[#233A66] text-white text-2xl">
          {errorMessage}
        </div>
      </section>
    );
  }

  // إذا مفيش أسئلة
  if (!questions || !questions.length) {
    return (
      <section className="min-h-screen w-full bg-[#233A66] flex flex-col">
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
        <div className="flex justify-center items-center h-screen bg-[#233A66] text-white text-2xl">
          Loading questions...
        </div>
      </section>
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
            {questions[currentQuestion]?.choices ? (
              Object.entries(questions[currentQuestion].choices).map(
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
              )
            ) : (
              <p className="text-red-500">No choices available for this question.</p>
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