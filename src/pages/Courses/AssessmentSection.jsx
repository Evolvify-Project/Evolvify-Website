import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { skills } from "./Data/SkillData";
import confetti from "canvas-confetti";

export default function AssessmentSection() {
  const { id } = useParams();
  const skill = skills.find((s) => s.id === id);

  if (!skill) {
    return (
      <div className="p-48 text-center text-5xl font-bold text-red-600">
        Skill not found!
      </div>
    );
  }

  const initialQuestions = [
    {
      questionText: "What is communication?",
      choices: {
        A: "Talking only",
        B: "Listening only",
        C: "Exchange of information",
        D: "Ignoring others",
      },
      correctAnswer: "C",
    },
    {
      questionText: "Which one improves communication?",
      choices: {
        A: "Interrupting",
        B: "Active listening",
        C: "Speaking louder",
        D: "Avoiding eye contact",
      },
      correctAnswer: "B",
    },
    {
      questionText: "Non-verbal communication includes?",
      choices: {
        A: "Emails",
        B: "Phone calls",
        C: "Body language",
        D: "Books",
      },
      correctAnswer: "C",
    },
    {
      questionText: "What is the key to effective communication?",
      choices: {
        A: "Assumptions",
        B: "Clarity",
        C: "Noise",
        D: "Guessing",
      },
      correctAnswer: "B",
    },
    {
      questionText: "What is active listening?",
      choices: {
        A: "Only hearing",
        B: "Hearing and understanding",
        C: "Ignoring the speaker",
        D: "Multitasking while listening",
      },
      correctAnswer: "B",
    },
    {
      questionText: "Which of these is an example of non-verbal communication?",
      choices: {
        A: "Writing an email",
        B: "Making eye contact",
        C: "Speaking loudly",
        D: "Sending a text message",
      },
      correctAnswer: "B",
    },
    {
      questionText: "Which of the following is NOT a communication barrier?",
      choices: {
        A: "Noise",
        B: "Language differences",
        C: "Active listening",
        D: "Distractions",
      },
      correctAnswer: "C",
    },
  ];

  const [questions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const calcProgress = ((currentQuestion + 1) / questions.length) * 100;
    setProgress(Math.round(calcProgress));
  }, [currentQuestion, questions.length]);

  const handleAnswerSelection = (key) => {
    setAnswers({
      ...answers,
      [currentQuestion]: key,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    let calculatedScore = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore += 1;
      }
    });

    const scorePercentage = (calculatedScore / questions.length) * 100;
    setScore(Math.round(scorePercentage));
    setShowResult(true);
  };

  const handleContinue = () => {
    setShowResult(false);
    setCurrentQuestion(0);
  };

  const getResultIcon = () => {
    if (score >= 75) {
      return <span className="text-4xl text-blue-500">🥳</span>;
    } else if (score >= 51) {
      return <i className="fas fa-meh text-yellow-500 text-4xl"></i>;
    } else {
      return <i className="fas fa-frown text-red-500 text-4xl"></i>;
    }
  };

  { /* Add fireworks */ }
  useEffect(() => {
    if (showResult && score >= 75 && score <= 100) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [showResult, score]);

  return (
    <section className="AssessmentSection">
      <div className="mx-auto min-h-screen p-6 bg-[#233A66] py-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">{skill.title}</h1>
          <p className="text-md text-gray-200">Beginner level assessment</p>
        </div>

        <div className="max-w-xl w-full text-center mx-auto p-3 sm:p-6 mt-16 relative z-10">
          {showResult ? (
            <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col items-center gap-5">
              <div className="mt-4">{getResultIcon()}</div>
              <h2 className="text-2xl font-semibold text-[#1E3A5F]">
                Assessment completed!!
              </h2>
              <div className="flex justify-between items-center w-full max-w-xs border border-gray-300 rounded-lg p-2">
                <span className="text-lg font-medium text-[#1E3A5F]">
                  Score
                </span>
                <span className="text-lg font-semibold text-[#67B4fF]">
                  {score}%
                </span>
              </div>

              <button
                onClick={handleContinue}
                className="mt-4 px-8 py-2 bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] text-white rounded-full transition-all duration-300"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col gap-8">
              <div className="relative w-full h-2 bg-gray-200 rounded-full mt-3">
                <div
                  className="absolute top-0 left-0 h-2 bg-lime-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="absolute top-0 h-2 w-6 bg-lime-500 rounded-full"
                  style={{ left: `calc(${progress}% - 12px)` }}
                >
                  <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-sm text-lime-500 font-semibold">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="text-left border border-[#233A66] px-2 py-1 shadow-xl rounded-xl text-slate-700 mt-4 font-semibold inline-block">
                Question {currentQuestion + 1} / {questions.length}
              </div>

              <h2 className="text-xl text-[#233A66] sm:text-2xl font-semibold">
                {questions[currentQuestion]?.questionText}
              </h2>

              <div className="space-y-5">
                {questions[currentQuestion]?.choices &&
                  Object.entries(questions[currentQuestion]?.choices).map(
                    ([key, option], index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelection(key)}
                        className={`cursor-pointer p-2 rounded-md border transition-all duration-300 ${
                          answers[currentQuestion] === key
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </div>
                    )
                  )}
              </div>

              <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-4 py-2 bg-blue-50 text-[#1E3A5F] rounded-full hover:bg-gray-300 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={
                    currentQuestion === questions.length - 1 ||
                    !answers[currentQuestion]
                  }
                  className="flex items-center px-4 py-2 bg-blue-50 text-[#1E3A5F] rounded-full hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                  <i className="fas fa-chevron-right ml-2"></i>
                </button>

                <button
                  onClick={handleFinish}
                  disabled={Object.keys(answers).length !== questions.length}
                  className={`px-6 py-2 text-white rounded-full transition-all duration-300 ${
                    Object.keys(answers).length === questions.length
                      ? "bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)]"
                      : "bg-gray-300"
                  }`}
                >
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
