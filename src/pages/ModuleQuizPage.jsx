import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";

export default function ModuleQuizPage() {
  const navigate = useNavigate();
  const { moduleId, moduleName } = useParams();

  const handleStartQuiz = () => {
    navigate(`/module-assessment/${moduleId}/${moduleName}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <div className="flex justify-center text-blue-600 text-4xl mb-4">
          <FaQuestionCircle />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[#1E3A5F]">
          Ready for the {moduleName} Quiz?
        </h2>
        <p className="text-gray-600 mb-2">
          You're about to begin the {moduleName} quiz. It contains{" "}
          <strong>5 quick questions</strong> and will take around{" "}
          <strong>3-5 minutes</strong>.
        </p>
        <p className="text-gray-600 mb-6">
          This quiz helps us understand your mastery of the {moduleName} module.
        </p>
        <button
          onClick={handleStartQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Start {moduleName} Quiz
        </button>
      </motion.div>
    </div>
  );
}
