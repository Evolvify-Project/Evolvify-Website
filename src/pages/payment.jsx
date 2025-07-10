import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import award from "../assets/images/Awards.jpg";
import axios from "axios";

const PremiumSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  // Static plans data
  const plans = [
    {
      id: 1,
      name: "Premium Plan",
      description: "Yearly Premium Plan",
      stripePriceId: "price_1RUTHfPi9o5FiMaJtcqMWQ4N",
      price: 100,
      currency: "usd",
      interval: "Yearly",
    },
    {
      id: 2,
      name: "Premium Plan",
      description: "Monthly Premium Plan",
      stripePriceId: "price_1RUTHIPi9o5FiMaJaZYV3zRq",
      price: 10,
      currency: "usd",
      interval: "Monthly",
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://evolvify.runasp.net/api/Payment/create-subscription",
        `"${selectedPlan.stripePriceId}"`, // Send stripePriceId as string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      window.location.href = response.data.data.checkoutSessionUrl; // Redirect to Stripe
    } catch (err) {
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
      <section className="container bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl text-center transition-all duration-300">
        {/* Award Icon */}
        <div className="mb-6">
          <img src={award} alt="Premium" className="h-24 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-blue-500 leading-tight">
            Upgrade to Premium <br />
            to unlock premium features
          </h2>
        </div>

        {/* Plans Selection */}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-blue-50 rounded-xl p-6 flex justify-between items-center hover:bg-blue-100 transition duration-300"
            >
              <span className="text-xl font-medium text-[#233A66]">
                {plan.name} - ${plan.price} {plan.interval}
              </span>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="bg-gradient-to-r from-[#64B5F6] to-[#3B6A90] text-white font-medium py-3 px-6 rounded-full shadow-md hover:scale-105 transition duration-300"
              >
                Select
              </button>
            </div>
          ))}
          {selectedPlan && (
            <button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-[#64B5F6] to-[#3B6A90] text-white font-semibold py-3 px-8 rounded-full mt-6 hover:scale-105 transition duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          )}
        </div>

        {/* Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6">
              <Dialog.Title className="text-xl font-semibold text-blue-600 mb-2">
                Premium Benefits ✨
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-4">
                - Unlimited practice sessions <br />
                - AI-Powered feedback <br />- Priority support and more!
              </Dialog.Description>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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

export default PremiumSection;