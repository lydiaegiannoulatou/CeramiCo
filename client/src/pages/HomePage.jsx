import React from "react";
import Gallery from "../components/Gallery";
import { ArrowRight, Star } from "lucide-react";

const HomePage = () => {
  return (
    <div className="bg-[#F5F2EB]">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/drszm8sem/image/upload/v1744978827/monochromatic-still-life-composition-with-tableware_oc2kfe.jpg')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#2F4138]/60 via-[#2F4138]/30 to-transparent" />

        {/* Text Content */}
        <div className="relative z-10 flex items-center justify-end h-full">
          <div className="container mx-auto px-6">
            <div className="ml-auto max-w-3xl text-right">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
                Artistry in
                <span className="block">Every Piece</span>
              </h1>
              <p className="font-sans text-xl text-white/90 mb-12 leading-relaxed ml-auto max-w-2xl">
                Discover our collection of handcrafted ceramics, where each piece tells 
                a unique story of craftsmanship and dedication to the art of pottery.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-end">
                <a
                  href="/shop"
                  className="group inline-flex items-center px-8 py-4 bg-white/95 text-[#2F4138] rounded-full hover:bg-white transition-all duration-300 text-lg font-sans shadow-lg hover:shadow-xl"
                >
                  View Collection
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/workshops"
                  className="group inline-flex items-center px-8 py-4 bg-[#2F4138]/20 text-white rounded-full hover:bg-[#2F4138]/30 transition-all duration-300 text-lg font-sans backdrop-blur-sm border border-white/30"
                >
                  Join Our Workshop
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80">
          <div className="w-px h-16 bg-white/30 mb-4 animate-pulse" />
          <span className="font-sans text-sm tracking-wider">Scroll to explore</span>
        </div>
      </div>

      {/* Featured Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center mb-16">
              <Star className="w-6 h-6 text-[#2F4138]/30" />
              <h2 className="font-display text-4xl text-center text-[#2F4138] mx-4">Our Craft</h2>
              <Star className="w-6 h-6 text-[#2F4138]/30" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Handcrafted",
                  description: "Each piece is carefully shaped and detailed by hand, ensuring unique character.",
                  number: "01"
                },
                {
                  title: "Sustainable",
                  description: "We use eco-friendly materials and practices throughout our creation process.",
                  number: "02"
                },
                {
                  title: "Timeless",
                  description: "Our designs blend traditional techniques with contemporary aesthetics.",
                  number: "03"
                }
              ].map((item) => (
                <div key={item.number} className="relative group">
                  <div className="absolute -top-8 -left-4 text-6xl font-display text-[#2F4138]/10 group-hover:text-[#2F4138]/20 transition-colors duration-300">
                    {item.number}
                  </div>
                  <h3 className="font-display text-2xl mb-4 text-[#2F4138]">{item.title}</h3>
                  <p className="font-sans text-[#5C6760] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with smooth transition */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-transparent" />
        <Gallery />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F2EB] to-transparent" />
      </div>
    </div>
  );
};

export default HomePage;