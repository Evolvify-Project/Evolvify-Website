import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SkillPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skillContent, setSkillContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to update module progress - DISABLED FOR NOW
  const updateModuleProgress = async (moduleId, isCompleted) => {
    // TODO: Re-enable when API issues are resolved
    console.log("Progress update disabled - would send:", {
      moduleId,
      isCompleted,
    });
    return { success: true }; // Mock successful response
  };
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await axios.get(
          `https://evolvify.runasp.net/api/Courses/${id}`
        );
        setSkillContent(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching skill:", error);
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleModuleClick = async (moduleId, moduleIndex) => {
    setModuleLoading(true);
    setActiveModuleIndex(moduleIndex);
    try {
      const res = await axios.get(
        `https://evolvify.runasp.net/api/Course/${id}/Modules/${moduleId}`
      );
      setActiveModule(res.data.data);
    } catch (error) {
      console.error("Error fetching module details:", error);
      setActiveModule(null);
    } finally {
      setModuleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">Loading...</div>
    );
  }

  if (!skillContent) {
    return (
      <div className="text-center py-10 text-red-600 text-lg">
        Skill not found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Modules List */}
          <aside className="bg-slate-50 rounded-xl shadow p-5 h-fit lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-[#233A66] mb-4">
              {skillContent.title}
            </h2>

            <div className="text-sm text-gray-600 mb-1">
              <strong>Level:</strong> {skillContent.level}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <strong>Duration:</strong> {skillContent.duration}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <strong>Modules:</strong> {skillContent.numberOfModules}
            </div>

            <div className="space-y-2">
              {skillContent.modules && skillContent.modules.length > 0 ? (
                skillContent.modules.map((module, index) => (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module.id, index)}
                    className={`p-3 rounded-lg cursor-pointer transition text-sm font-medium ${
                      activeModule?.id === module.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {module.title}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No modules available.</p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Skill Info */}
            <section className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold text-[#233A66] mb-3">
                {skillContent.title}
              </h1>
              <p className="text-gray-700 leading-relaxed">
                {skillContent.description}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {skillContent.skill}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {skillContent.level}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full ml-auto">
                  ⏱ {skillContent.duration}
                </span>
              </div>
            </section>

            {/* Module Details */}
            <section className="bg-white rounded-xl shadow p-6">
              {moduleLoading ? (
                <p className="text-center text-gray-400 italic">
                  Loading module...
                </p>
              ) : activeModule ? (
                <>
                  <h2 className="text-2xl font-bold text-[#233A66] mb-3">
                    {activeModule.title}
                  </h2>

                  {activeModule.contents && activeModule.contents.length > 0 ? (
                    activeModule.contents.map((contentItem) => (
                      <div key={contentItem.id} className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {contentItem.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{contentItem.text}</p>

                        {contentItem.contentType === "Video" &&
                          contentItem.url && (
                            <div className="aspect-video">
                              <iframe
                                src={contentItem.url.replace(
                                  "watch?v=",
                                  "embed/"
                                )}
                                title={contentItem.title}
                                allowFullScreen
                                className="w-full h-full rounded-lg"
                              ></iframe>
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No content available for this module.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400 italic text-center">
                  Select a module to view its contents.
                </p>
              )}

              {/* Navigation Buttons - Always Visible */}
              {activeModule && (
                <div className="bg-red-100 border-2 border-red-500 p-6 rounded-lg mt-8">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-red-700">
                      Navigation Controls
                    </h3>
                    <p className="text-sm text-red-600">
                      Module: {activeModule.title} ({activeModuleIndex + 1} of{" "}
                      {skillContent.modules.length})
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    {activeModuleIndex < skillContent.modules.length - 1 ? (
                      // Next Module Button
                      <button
                        onClick={async () => {
                          setIsSubmitting(true);
                          try {
                            await updateModuleProgress(activeModule.id, true);
                            // Move to next module
                            const nextModule =
                              skillContent.modules[activeModuleIndex + 1];
                            handleModuleClick(
                              nextModule.id,
                              activeModuleIndex + 1
                            );
                          } catch (error) {
                            console.error("Error updating progress:", error);
                            alert(`Error updating progress: ${error.message}`);
                            // Still move to next module even if API fails
                            const nextModule =
                              skillContent.modules[activeModuleIndex + 1];
                            handleModuleClick(
                              nextModule.id,
                              activeModuleIndex + 1
                            );
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
                            Next Module
                            <i className="fas fa-chevron-right ml-2"></i>
                          </>
                        )}
                      </button>
                    ) : (
                      // Finish Course Button (Last Module)
                      <button
                        onClick={async () => {
                          setIsSubmitting(true);
                          try {
                            await updateModuleProgress(activeModule.id, true);
                            navigate(
                              `/module-quiz/${activeModule.id}/${activeModule.title}`
                            );
                          } catch (error) {
                            console.error("Error updating progress:", error);
                            alert(`Error updating progress: ${error.message}`);
                            navigate(
                              `/module-quiz/${activeModule.id}/${activeModule.title}`
                            );
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
                            Finish Course
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}
