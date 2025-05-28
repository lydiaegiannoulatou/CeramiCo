import React from "react";
import { Link } from "react-router-dom";

const FaqPage = () => {
  return (
    <div className="bg-[#F5F2EB] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display text-[#2F4138] text-center mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-10 text-[#5C6760] font-sans text-lg leading-relaxed">
          <div className="faq-item">
            <h2 className="text-2xl font-display text-[#2F4138] mb-2">
              1. What is CeramiCo?
            </h2>
            <p>
              CeramiCo is my graduation project for Social Hackers Academy.
              With a Fine Arts background and a love for working with clay,
              I originally envisioned a physical pottery studio. But discovering
              Full Stack Development opened a new creative path—this platform
              blends both passions: pottery and programming.
            </p>
          </div>

          <div className="faq-item">
            <h2 className="text-2xl font-display text-[#2F4138] mb-2">
              2. How can I purchase your pottery products?
            </h2>
            <p>
              You can browse and purchase curated handmade ceramics directly
              through our <Link to="/shop" className="text-[#2F4138] underline">Shop Page</Link>. Each item is unique and carefully selected for its craftsmanship.
            </p>
          </div>

          <div className="faq-item">
            <h2 className="text-2xl font-display text-[#2F4138] mb-2">
              3. Do you offer international shipping?
            </h2>
            <p>
              Currently, CeramiCo does not handle logistics directly. All products are sourced from artisan platforms that may offer international shipping—details are available on each product's page.
            </p>
          </div>

          <div className="faq-item">
            <h2 className="text-2xl font-display text-[#2F4138] mb-2">
              4. How do I book a pottery workshop?
            </h2>
            <p>
              You can book a session through our <Link to="/workshops" className="text-[#2F4138] underline">Workshop Page</Link>. We offer small-group workshops perfect for beginners and creatives who want hands-on experience.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-[#5C6760]">
          <p>
            Still have questions? <Link to="/contact" className="text-[#2F4138] underline">Contact us</Link> and we’ll be happy to help!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
