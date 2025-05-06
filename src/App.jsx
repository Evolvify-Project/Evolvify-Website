

import Login from "./pages/Login";
import Sign from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Home from "./pages/Home";
import Courses from "./pages/Courses/Courses";
import SkillDetailsPage from "./pages/Courses/SkillDetails";
import LearningUnitPage from "./pages/Courses/LearningUnitPage";
import AssessmentSection from "./pages/Courses/AssessmentSection";
import NotFound from "./pages/NotFound/NotFound";
import PremiumSection from "./pages/Practice";
import Community from "./pages/Community";
import Chatbot from "./pages/Chatbot";
import Quiz from "./pages/Quiz";
import ResultPage from "./pages/Result";
import RecommendedPlan from "./pages/RecommendedPlan";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/payment";
import EmotionAnalysis from "./pages/EmotionalAnalysis";
import Summary from "./pages/Summary";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { SiChatbot } from "react-icons/si";
import { EmotionProvider } from "./pages/EmotionContext"; // عدّل المسار لأنه في src/pages/

// Error Boundary Component
const ErrorPage = ({ error }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="p-6 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold text-red-600">
        Oops! Something Went Wrong
      </h1>
      <p className="text-gray-600 mt-2">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Go to Home
      </button>
    </div>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Navigate to="/home" /> },
        { path: "login", element: <Login />, errorElement: <ErrorPage /> },
        { path: "signup", element: <Sign />, errorElement: <ErrorPage /> },
        {
          path: "forget-password",
          element: <ForgetPassword />,
          errorElement: <ErrorPage />,
        },
        { path: "home", element: <Home />, errorElement: <ErrorPage /> },
        {
          path: "courses",
          element: <Courses />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: ":id",
              element: <SkillDetailsPage />,
              errorElement: <ErrorPage />,
            },
            {
              path: ":id/learning-unit",
              element: <LearningUnitPage />,
              errorElement: <ErrorPage />,
            },
            {
              path: ":id/assessment",
              element: <AssessmentSection />,
              errorElement: <ErrorPage />,
            },
          ],
        },
        {
          path: "practice",
          element: <PremiumSection />,
          errorElement: <ErrorPage />,
        },
        {
          path: "community",
          element: <Community />,
          errorElement: <ErrorPage />,
        },
        { path: "chatbot", element: <Chatbot />, errorElement: <ErrorPage /> },
        { path: "quiz", element: <Quiz />, errorElement: <ErrorPage /> },
        {
          path: "result",
          element: <ResultPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "recommended-plan",
          element: <RecommendedPlan />,
          errorElement: <ErrorPage />,
        },
        { path: "payment", element: <Payment />, errorElement: <ErrorPage /> },
        {
          path: "emotion-analysis",
          element: <EmotionAnalysis />,
          errorElement: <ErrorPage />,
        },
        {
          path: "summary",
          element: <Summary />,
          errorElement: <ErrorPage />,
        },
        { path: "*", element: <NotFound />, errorElement: <ErrorPage /> },
        { path: "dashboard", element: <Dashboard /> },
      ],
    },
  ]);

  return (
    <div className="min-h-screen">
      <EmotionProvider>
        <RouterProvider router={router} />
      </EmotionProvider>
    </div>
  );
}

export default App;
