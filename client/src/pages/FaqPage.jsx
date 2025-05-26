import React from "react";
import { Link } from "react-router-dom";

const FaqPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6">
        <div className="faq-item">
          <h2 className="text-xl font-semibold">1. What is CeramiCo?</h2>
          <p className="text-lg">
            CeramiCo is my graduation project for Social Hackers Academy. With a background in Fine Arts and a long-standing love for working with clay, I had originally planned to open my own pottery studio. However, discovering the world of Full Stack Development opened up new creative possibilities. This project is a fusion of my two passions—pottery and programming—bringing them together in a meaningful and personal way.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">2. How can I purchase your pottery products?</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. Visit our <Link to="/shop" className="text-blue-500">Shop Page</Link> for more.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">3. Do you offer international shipping?</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">4. How do I book a pottery workshop?</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visit our <Link to="/workshops" className="text-blue-500">Workshop Page</Link> to find available sessions and reserve your spot.
          </p>
        </div>


      </div>

      <div className="mt-8 text-center">
        <p className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <Link to="/contact" className="text-blue-500">Contact us</Link> for further assistance.
        </p>
      </div>
    </div>
  );
};

export default FaqPage;
