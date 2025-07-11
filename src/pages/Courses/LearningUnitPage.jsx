import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeUnit, setActiveUnit] = useState(1);

  // Function to update module progress
  const updateModuleProgress = async (moduleId, isCompleted) => {
    try {
      const response = await axios.post(
        `https://evolvify.runasp.net/api/Progress/module`,
        {
          moduleId,
          isCompleted,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating module progress:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axios.get(
          `https://evolvify.runasp.net/api/Course/${id}/Modules/${id}`
        );
        setModule(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Module not found!");
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !module) return <div className="p-6 text-red-600">{error}</div>;

  const { title, contents = [] } = module;

  // Debug info
  console.log("Module data:", module);
  console.log("Contents length:", contents.length);
  console.log("Active unit:", activeUnit);

  const description =
    contents[0]?.descriptionPage || "No description available.";
  const learnings = contents[0]?.learnings || [];
  const sidebarLinks = contents.map(
    (item, index) => item.title || `Unit ${index + 1}`
  );
  const videoUrl = contents[0]?.videoUrl || "";

  return (
    <div className="p-4 mt-16 flex flex-col lg:grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="bg-slate-100 rounded-lg shadow w-full p-4 lg:p-6 h-fit lg:sticky lg:top-8 flex flex-col">
        <h2 className="text-xl font-bold text-[#233A66] mb-2">{title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div>unit {activeUnit}</div>
          <div>Course ID: {module.courseId}</div>
        </div>

        <div className="space-y-6 flex-1">
          {sidebarLinks?.map((link, index) => {
            const unitNumber = index + 1;
            return (
              <div
                key={index}
                onClick={() => setActiveUnit(unitNumber)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeUnit === unitNumber
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="text-base">{link}</div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="md:col-span-3 space-y-6">
        <div className="text-xl font-bold text-center text-[#233A66]">
          Unit {activeUnit}
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-md h-64 bg-gray-100 flex items-center justify-center">
          {videoUrl ? (
            <video
              className="w-full h-full object-cover"
              controls
              src={videoUrl}
            />
          ) : (
            <span className="text-gray-400">Video placeholder</span>
          )}
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-microphone"></i> Mastering {title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          <h3 className="text-md font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-magnifying-glass"></i> What you’ll learn
          </h3>
          {learnings.length > 0 ? (
            <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              {learnings.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No learning points available.
            </p>
          )}
        </div>

        {/* Navigation Buttons - Always Visible */}
        <div className="bg-red-100 border-2 border-red-500 p-6 rounded-lg mt-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-red-700">
              Navigation Controls
            </h3>
            <p className="text-sm text-red-600">
              Module: {title} | Unit: {activeUnit} of{" "}
              {Math.max(contents.length, 1)}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {contents.length > 1 && activeUnit > 1 && (
              <button
                onClick={() => setActiveUnit(Math.max(1, activeUnit - 1))}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
              >
                <i className="fas fa-chevron-left mr-2"></i>
                Previous Unit
              </button>
            )}

            {contents.length > 1 && activeUnit < contents.length ? (
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await updateModuleProgress(parseInt(id), false);
                    setActiveUnit(activeUnit + 1);
                  } catch (error) {
                    console.error("Error updating progress:", error);
                    setActiveUnit(activeUnit + 1);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-bold"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    Next Unit
                    <i className="fas fa-chevron-right ml-2"></i>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await updateModuleProgress(parseInt(id), true);
                    navigate(`/module-quiz/${id}/${title}`);
                  } catch (error) {
                    console.error("Error updating progress:", error);
                    navigate(`/module-quiz/${id}/${title}`);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-300 font-bold"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Finishing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Finish Module
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
