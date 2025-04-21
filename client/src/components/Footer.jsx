import React from "react";

export const Footer = () => {
  const footerLinks = [
    { text: "Connect with Social", position: "left" },
    { text: "Subscribe", position: "left" },
    { text: "FAQ", position: "right" },
    { text: "About", position: "right" },
    { text: "Contact Us", position: "right" },
  ];

  return (
    <footer className="w-full bg-[#3A4D39] text-[#FFFBF3] flex flex-col md:flex-row items-center justify-between px-4 md:px-14 py-3 gap-4 md:gap-0 fixed bottom-0 left-0 z-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-8">
        {footerLinks
          .filter((link) => link.position === "left")
          .map((link, index) => (
            <button
              key={index}
              className="font-['Cormorant_Garamond',Helvetica] font-normal text-lg md:text-xl hover:opacity-80 transition-opacity"
            >
              {link.text}
            </button>
          ))}
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-8">
        {footerLinks
          .filter((link) => link.position === "right")
          .map((link, index) => (
            <button
              key={index}
              className="font-['Cormorant_Garamond',Helvetica] font-normal text-lg md:text-xl hover:opacity-80 transition-opacity"
            >
              {link.text}
            </button>
          ))}
      </div>
    </footer>
  );
};
