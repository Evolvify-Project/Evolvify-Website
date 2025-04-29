import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import masterCard from "../assets/images/mastercard_payment.png";
import payPal from "../assets/images/payment_paypal.png";
import visaCard from "../assets/images/payment_visa.png";

const PaymentSection = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("Credit Card");
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isFormValid = () => {
    const { cardholderName, cardNumber, expiryDate, securityCode } = formData;
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    const securityCodeRegex = /^\d{3,4}$/;
    return (
      cardholderName.trim() !== "" &&
      cardNumberRegex.test(cardNumber) &&
      expiryDateRegex.test(expiryDate) &&
      securityCodeRegex.test(securityCode)
    );
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      if (isFormValid()) {
        setMessage({ type: "success", text: "Payment Successful!" });
        setFormData({
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          securityCode: "",
          rememberMe: false,
        });
        setTimeout(() => {
          setMessage(null);
        }, 4000);
      } else {
        setMessage({
          type: "error",
          text: "Invalid Card Details. Please check your input.",
        });
      }
    }, 2000);
  };

  const handleBack = () => {
    navigate("/practice");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 max-w-6xl px-4">
        <div className="arrow mb-4">
          <button
            onClick={handleBack}
            className="text-gray-800 hover:text-lime-400 focus:outline-none flex items-center gap-2 p-2 rounded-full border-2  border-gray-900 hover:bg-blue-50 transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-left-long text-xl"></i>
          </button>
        </div>

        {/* Payment Methods */}
        <div className="PaymentMethods bg-white rounded-2xl shadow-2xl p-6 w-full lg:w-1/2">
          <div className="border border-[#64B5F6] rounded-2xl p-2">
            <h2 className="text-xl sm:text-lg md:text-xl font-bold text-center text-blue-500 mb-4">
              PAYMENT METHODS
            </h2>

            {/* Payment Icons */}
            <div className="PaymentIcons flex flex-wrap justify-between items-center gap-4 mb-6">
              <img
                src={masterCard}
                className="h-16 sm:h-12 md:h-16 w-auto max-w-[60px] sm:max-w-[50px] object-contain transform hover:scale-110 transition-transform duration-300"
                alt="MasterCard"
              />
              <img
                src={payPal}
                className="h-16 sm:h-12 md:h-16 w-auto max-w-[60px] sm:max-w-[50px] object-contain transform hover:scale-110 transition-transform duration-300"
                alt="PayPal"
              />
              <img
                src={visaCard}
                className="h-16 sm:h-12 md:h-16 w-auto max-w-[60px] sm:max-w-[50px] object-contain transform hover:scale-110 transition-transform duration-300"
                alt="Visa"
              />
            </div>
          </div>

          <div className="font-semibold mt-5">
            <p className="mb-1 text-sm sm:text-base md:text-lg">
              Choose your credit card:
            </p>
          </div>

          {/* Payment Options */}
          <div className="PaymentOptions space-y-4 p-6 border border-[#64B5F6] rounded-2xl mb-7">
            {["PayPal", "Credit Card", "Visa"].map((method) => (
              <div
                key={method}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:shadow-lg ${
                  selectedMethod === method
                    ? "border-blue-500 bg-blue-50 scale-105"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleMethodChange(method)}
              >
                <div className="flex items-center gap-4">
                  {method === "PayPal" && (
                    <img
                      src={payPal}
                      alt="PayPal"
                      className="h-10 sm:h-8 md:h-10 w-auto max-w-[40px] sm:max-w-[35px] object-contain"
                    />
                  )}
                  {method === "Credit Card" && (
                    <img
                      src={masterCard}
                      alt="Credit Card"
                      className="h-10 sm:h-8 md:h-10 w-auto max-w-[40px] sm:max-w-[35px] object-contain"
                    />
                  )}
                  {method === "Visa" && (
                    <img
                      src={visaCard}
                      alt="Visa"
                      className="h-10 sm:h-8 md:h-10 w-auto max-w-[40px] sm:max-w-[35px] object-contain"
                    />
                  )}
                  <span className="text-sm sm:text-base md:text-lg text-gray-700">
                    {method} ••••10785**
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method}
                  onChange={() => handleMethodChange(method)}
                  className="h-5 w-5 text-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="PricingPlans mt-6 space-y-4">
            <div className="UnlimitedPlan bg-gradient-to-r from-[#64B5F6] to-[#233A66] text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center transform hover:scale-105 transition-transform duration-300">
              <div>
                <span className="text-lg sm:text-base md:text-lg font-semibold">
                  Unlimited plan
                </span>
                <p className="text-sm sm:text-base md:text-sm mt-2 sm:mt-0">
                  One time purchase
                </p>
              </div>
              <span className="text-xl sm:text-lg md:text-xl font-bold">
                $120.00
              </span>
            </div>

            <div className="YearlyPlan bg-gradient-to-r from-[#64B5F6] to-[#233A66] text-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center transform hover:scale-105 transition-transform duration-300">
              <div>
                <span className="text-lg sm:text-base md:text-lg font-semibold">
                  Yearly plan
                </span>
                <p className="text-sm sm:text-base md:text-sm">
                  $75 billed every year
                </p>
              </div>
              <span className="text-xl sm:text-lg md:text-xl font-bold">
                $5.99/mo
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="PaymentForm bg-white rounded-2xl shadow-2xl p-6 w-full lg:w-1/2">
          <div className="border border-[#64B5F6] rounded-2xl p-2">
            <h2 className="text-xl font-bold text-center text-blue-500 mb-4">
              PAYMENT FORM
            </h2>
            <h3 className="text-lg font-semibold text-[#233A66] mb-4">
              PAYMENT INFORMATION
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cardholder Name */}
              <input
                type="text"
                name="cardholderName"
                placeholder="Cardholder name"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  formData.cardholderName.trim()
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              {/* Card Number */}
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  formData.cardNumber
                    ? /^\d{16}$/.test(formData.cardNumber)
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber) && (
                <p className="text-red-500 text-sm mt-1">
                  Card number must be 16 digits
                </p>
              )}

              {/* Expiry and Security */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="ExpiryDate w-full md:w-1/2">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM / YYYY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formData.expiryDate
                        ? /^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiryDate)
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>

                <div className="SecurityCode w-full md:w-1/2">
                  <input
                    type="text"
                    name="securityCode"
                    placeholder="Security code"
                    value={formData.securityCode}
                    onChange={handleInputChange}
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formData.securityCode
                        ? /^\d{3,4}$/.test(formData.securityCode)
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {formData.securityCode &&
                    !/^\d{3,4}$/.test(formData.securityCode) && (
                      <p className="text-red-500 text-sm mt-1">
                        Security Code must be 4 digits
                      </p>
                    )}
                </div>
              </div>

              {/* Remember Me */}
              <div className="RememberMe flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-500 mr-2 transition-all duration-300"
                />
                <label className="text-gray-700">Remember Me</label>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-center ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full py-3 rounded-full text-white font-semibold transition-all duration-300 ${
                  isFormValid() && !isLoading
                    ? "bg-gradient-to-r from-[#64B5F6] to-[#233A66]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
