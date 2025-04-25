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
            CeramiCo is a pottery studio that specializes in handmade pottery products, including mugs, bowls, vases, and more. Each piece is carefully crafted by skilled artisans. We also offer workshops for pottery enthusiasts who want to try their hand at creating their own pottery!
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">2. How can I purchase your pottery products?</h2>
          <p className="text-lg">
            You can browse and purchase our pottery products directly on our website. Simply visit our <Link to="/shop" className="text-blue-500">Shop Page</Link> to view our collection. We offer secure payment options and ship worldwide.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">3. Do you offer international shipping?</h2>
          <p className="text-lg">
            Yes, we offer international shipping! Once you make a purchase, you'll be able to choose from various shipping options during checkout. Please note that shipping fees may vary depending on your location.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">4. How do I book a pottery workshop?</h2>
          <p className="text-lg">
            To book a workshop, visit our <Link to="/workshops" className="text-blue-500">Workshop Page</Link>. You can browse available workshops and choose the one that suits your schedule. After selecting a workshop, follow the instructions to complete your booking.
          </p>
        </div>

        <div className="faq-item">
          <h2 className="text-xl font-semibold">5. Do you offer gift cards?</h2>
          <p className="text-lg">
            Yes! We offer digital gift cards for those looking to give the gift of handmade pottery or a pottery workshop experience. You can purchase a gift card through our <Link to="/gift-cards" className="text-blue-500">Gift Cards Page</Link>.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg">
          If you have any more questions, feel free to <Link to="/contact" className="text-blue-500">contact us</Link>. We are happy to assist!
        </p>
      </div>
    </div>
  );
};

export default FaqPage;
