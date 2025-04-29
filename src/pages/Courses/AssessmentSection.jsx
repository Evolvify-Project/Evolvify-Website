import { useState } from "react";
import { useParams } from "react-router-dom";
import { skills } from "./Data/SkillData";

export default function AssessmentSection() {
  const { id } = useParams();
  const skill = skills.find((s) => s.id === id);

  if (!skill) {
    return (
      <div className="p-6 text-4xl font-bold text-red-600">
        Skill not found!
      </div>
    );
  }

  const [progress, setProgress] = useState(66);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const handleAdd = () => {
    if (!question.trim()) return;
    if (typeof isEditing === "number") {
      const updated = [...questions];
      updated[isEditing] = question;
      setQuestions(updated);
      setIsEditing(null);
    } else {
      setQuestions([...questions, question]);
    }
    setQuestion("");
  };

  return (
    <section className="AssessmentSection py-12">
      <div className="container mx-auto p-6 bg-white py-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#233A66]">{skill.title}</h1>
          <p className="text-sm text-gray-600">Beginner level assessment</p>

          <div className="relative w-full h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="absolute top-0 left-0 h-2 bg-lime-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <div
              className="absolute top-0 h-2 w-6 bg-lime-500 rounded-full"
              style={{ left: `calc(${progress}% - 12px)` }}
            >
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-lime-500 font-semibold">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="SectionQuestion bg-slate-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Question 4
          </h2>

          <div className="border-t border-gray-400 pt-4">
            <div className="mb-4">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 mb-2 shadow-sm"
                >
                  {isEditing === i ? (
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      className="w-full mr-4 border-b border-gray-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-800">{q}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(i);
                        setQuestion(q);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                      onClick={() => {
                        const newQs = [...questions];
                        newQs.splice(i, 1);
                        setQuestions(newQs);
                        if (isEditing === i) {
                          setIsEditing(null);
                          setQuestion("");
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none"
              />
              <button
                onClick={handleAdd}
                className="p-2 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition"
            onClick={() => alert("Go to previous question")}
          >
            <span className="text-lg">
              <i className="fa-solid fa-arrow-left-long"></i>
            </span>{" "}
            Previous
          </button>

          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition"
              onClick={() => alert("Go to next question")}
            >
              Next{" "}
              <span className="text-lg">
                <i className="fa-solid fa-arrow-right-long"></i>
              </span>
            </button>

            <button
              className="px-4 py-2 bg-gradient-to-r bg-[#233A66] text-white rounded-full hover:bg-[#333A99] transition"
              onClick={() => alert("Finish assessment")}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
