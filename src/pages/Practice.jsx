import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import award from "../assets/images/Awards.jpg";
import axios from "axios";
import environment from "../config/environment";

const PracticeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          "https://evolvify.runasp.net/api/Payment/subscription-status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
        setSubscription(response.data.data);
      } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [navigate, token]);

  const handleAction = (path) => {
    if (loading) return;

    if (subscription) {
      const now = new Date(); // Current date: July 10, 2025, 05:35 PM EEST
      const endDate = new Date(subscription.endDate);
      if (!subscription.isActive || now > endDate) {
        navigate("/payment"); // Redirect to payment if subscription expired
        return;
      }
    }

    // Use React Router navigate for internal routes
    navigate(path);
  };

  if (loading)
    return (
      <p className="text-[#233A66] text-center py-10">
        Loading subscription status...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-50 to-blue-50 flex items-center justify-center py-16">
      <section className="container bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-3xl text-center transition-all duration-500 transform hover:scale-102 border border-gray-200">
        {/* Award Icon and Title */}
        <div className="mb-10">
          <img
            src={award}
            alt="Premium"
            className="h-32 mx-auto mb-6 rounded-xl shadow-lg border-2 border-white/80"
          />
          <h2 className="text-4xl font-extrabold mb-2 leading-tight bg-gradient-to-r from-[#64B5F6] to-[#1E3A8A] bg-clip-text text-transparent drop-shadow-md">
            Upgrade to Premium to Start Practice
          </h2>
          <p className="text-gray-600 text-lg">
            Unlock your potential with premium features!
          </p>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={() => handleAction("/payment")}
          className="bg-gradient-to-r from-[#4FC3F7] via-[#42A5F5] to-[#1E88E5] text-white font-bold py-4 px-10 rounded-xl mb-10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
        >
          Upgrade Now
        </button>

        {/* Practice Options */}
        <div className="space-y-6">
          {["Practice Interview", "Practice Presentation"].map((label, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center hover:bg-white/90 hover:shadow-2xl transition-all duration-300 border border-blue-100/70 hover:border-[#42A5F5]"
            >
              <span className="text-2xl font-semibold text-[#1E3A8A] drop-shadow-sm">
                {label}
              </span>
              <button
                onClick={() =>
                  handleAction(
                    i === 0 ? "/interview-test" : "/presentation-test"
                  )
                }
                className="bg-gradient-to-r from-[#4FC3F7] via-[#42A5F5] to-[#1E88E5] text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Practice Now
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-gray-200">
              <Dialog.Title className="text-3xl font-bold text-[#1E3A8A] mb-6">
                Premium Benefits ✨
              </Dialog.Title>
              <Dialog.Description className="text-gray-700 mb-8 text-lg leading-relaxed">
                - Unlimited practice sessions <br />
                - AI-Powered feedback <br />- Priority support and more!
              </Dialog.Description>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-[#4FC3F7] to-[#1E88E5] text-white px-6 py-3 rounded-lg hover:bg-[#1E88E5] transition duration-300 shadow-md"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </section>
    </div>
  );
};

export default PracticeSection;
