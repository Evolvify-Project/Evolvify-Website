import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrophy, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function CourseQuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, courseName } = useParams();

  // Get the results from location state
  const {
    score,
    totalQuestions,
    correctAnswers,
    courseName: stateCourseName,
  } = location.state || {};

  const finalCourseName = courseName || stateCourseName || "Course";
  const finalScore = score || 0;
  const finalTotalQuestions = totalQuestions || 5;
  const finalCorrectAnswers = correctAnswers || 0;

  const getScoreMessage = () => {
    if (finalScore >= 80) {
      return "Excellent! You've mastered this course.";
    } else if (finalScore >= 60) {
      return "Good job! You have a solid understanding.";
    } else {
      return "Keep practicing! Review the course content.";
    }
  };

  const getScoreColor = () => {
    if (finalScore >= 80) return "text-green-600";
    if (finalScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = () => {
    if (finalScore >= 80)
      return <FaTrophy className="text-4xl text-yellow-500" />;
    if (finalScore >= 60)
      return <FaCheckCircle className="text-4xl text-green-500" />;
    return <FaTimesCircle className="text-4xl text-red-500" />;
  };

  const handleContinue = () => {
    navigate("/courses"); // Navigate back to courses or wherever appropriate
  };

  const handleRetake = () => {
    navigate(`/course-quiz/${courseId}/${finalCourseName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">{getScoreIcon()}</div>
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
              {finalCourseName}
              <br />
              Quiz Results
            </h1>
            <p className="text-gray-600">{getScoreMessage()}</p>
          </div>

          {/* Score Card */}
          <div
            className="bg-gradient-to-r from-[#5BBEF1] to-[#233A66] rounded-xl p-6 mb-8 text-white
             transition duration-300 ease-in-out
             hover:scale-102 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{finalScore}%</div>
              <div className="text-lg opacity-90">Your Score</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {finalCorrectAnswers}
              </div>
              <div className="text-green-700 font-medium">Correct Answers</div>
            </div>

            <div className="bg-red-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {finalTotalQuestions - finalCorrectAnswers}
              </div>
              <div className="text-red-700 font-medium">Incorrect Answers</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Accuracy
              </span>
              <span className="text-sm font-medium text-gray-700">
                {finalScore}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  finalScore < 60
                    ? "bg-red-500"
                    : finalScore < 80
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${finalScore}%` }}
              ></div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#1E3A5F] mb-4">
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium">{finalTotalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-medium text-green-600">
                  {finalCorrectAnswers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Incorrect Answers:</span>
                <span className="font-medium text-red-600">
                  {finalTotalQuestions - finalCorrectAnswers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy Rate:</span>
                <span className={`font-medium ${getScoreColor()}`}>
                  {finalScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleContinue}
              className="flex-1 bg-gradient-to-r from-[#5BBEF1] to-[#233A66] text-white py-3 px-6 rounded-xl font-medium
               relative overflow-hidden transition-all duration-300 ease-out
               hover:scale-105 hover:shadow-lg hover:brightness-110"
            >
              Continue Learning
            </button>
            <button
              onClick={handleRetake}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium
               transition-all duration-300 ease-out
               hover:scale-105 hover:shadow-md hover:bg-gray-300"
            >
              Retake Quiz
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
