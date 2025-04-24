// src/pages/FailPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle, AiOutlineArrowLeft } from "react-icons/ai"; // react‑icons

const FailPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate("/cart"); // adjust as needed

  return (
    <section className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center p-8">
      {/* background accent */}
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-60 w-60 translate-x-1/3 -translate-y-1/3 rounded-full bg-rose-400/15 blur-3xl" />

      {/* card */}
      <div className="w-full rounded-3xl bg-white/70 p-10 text-center backdrop-blur-lg">
        {/* react‑icons error symbol */}
        <AiOutlineCloseCircle className="mx-auto h-16 w-16 text-rose-500" />

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-800">
          Payment canceled
        </h1>
        <p className="mt-2 text-gray-600">
          Your payment didn’t go through or was canceled. You can try again or
          go back to your cart.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-rose-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            Retry Payment
          </button>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50/80"
          >
            <AiOutlineArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default FailPage;
