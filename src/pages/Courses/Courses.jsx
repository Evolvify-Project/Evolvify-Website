import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import SkillCard from "./SkillCard";
import studentLearningImg from "../../assets/images/Learning-rafiki.svg";

const CoursesPage = () => {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]); // <-- New state to keep all courses
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        "https://evolvify.runasp.net/api/Courses",
        {
          params: {
            pageNumber: currentPage,
            pageSize: pageSize,
          },
        }
      );
      const data = response.data.data;
      setAllSkills(data); // Save all courses
      filterCourses(data); // Apply filtering
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const filterCourses = (courses) => {
    let filtered = courses;

    if (selectedTopic) {
      filtered = filtered.filter((course) =>
        course.skill.toLowerCase().includes(selectedTopic.toLowerCase())
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter(
        (course) => course.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    setSkills(filtered);
  };

  useEffect(() => {
    fetchSkills();
  }, [currentPage]);

  useEffect(() => {
    filterCourses(allSkills); // Re-filter when topic or level changes
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [selectedTopic, selectedLevel]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Header */}
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="header px-28 py-4 flex justify-around">
          <div className="flex flex-col gap-4 text-darkBlue">
            <h1 className="text-4xl font-bold">Our Courses</h1>
            <div className="flex items-center text-md">
              <Link
                to="/home"
                className="flex items-center cursor-pointer text-md"
              >
                <span>Home</span>
                <p className="mx-2">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                </p>
              </Link>
              <span>Courses</span>
            </div>
          </div>
        </div>
        <img
          src={studentLearningImg}
          alt="Student studying"
          className="w-[450px] h-auto pr-14"
        />
      </div>

      {/* Filters */}
      <div className="filters py-6">
        <p className="text-3xl font-bold text-center mb-6 text-darkBlue">
          Develop Your Soft Skills for Success!
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          {/* Topic Filter */}
          <div className="flex flex-col">
            <select
              id="topic"
              className="px-1 py-2 border-2 border-darkBlue rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-darkBlue"
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
              }}
            >
              <option value="">All Topics</option>
              <option value="presentation">Presentation</option>
              <option value="interview">Interview</option>
              <option value="communication">Communication</option>
              <option value="teamwork">Teamwork</option>
              <option value="time management">Time Management</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex flex-col">
            <select
              id="level"
              className="px-4 py-2 border-2 border-darkBlue rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-darkBlue"
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
              }}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        {skills.length > 0 ? (
          skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No courses found
          </p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center items-center gap-4 py-6">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-darkBlue hover:bg-blue-800"
          }`}
        >
          Previous
        </button>

        <span className="font-medium text-darkBlue">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-darkBlue hover:bg-blue-800"
          }`}
        >
          Next
        </button>
      </div>

      <Outlet />
    </section>
  );
};

export default CoursesPage;
