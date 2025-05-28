import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-[#F5F2EB] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display text-[#2F4138] text-center mb-12">
          About <span className="italic">CeramiCo</span>
        </h1>

        <div className="text-[#5C6760] text-lg space-y-8 font-sans leading-relaxed">
          <p>
            Welcome to <strong>CeramiCo</strong>—a unique online space where pottery meets creativity and craftsmanship.
            Whether you're a seasoned enthusiast or simply looking to add an artisanal touch to your home, CeramiCo
            offers a curated selection of beautiful, high-quality handmade ceramics.
          </p>

          <p>
            But CeramiCo is more than just an online shop. It’s also a place to explore your own creativity. We host
            pottery workshops designed to help you discover the joy of shaping clay and creating something truly personal
            with your own hands.
          </p>

          <p>
            This platform was created as part of my <strong>graduation project at Social Hackers Academy</strong>.
            With a background in Fine Arts and a deep love for working with clay, my original plan was to open a physical
            pottery studio. But along the way, I discovered the world of Full Stack Development, and it opened up new
            creative possibilities. CeramiCo is the result—a blend of two passions: pottery and programming.
          </p>

          <p>
            The beautiful ceramics featured on CeramiCo are sourced from{" "}
            <a
              href="https://www.giftedartisan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2F4138] underline"
            >
              Gifted Artisan
            </a>
            , a platform that celebrates the work of talented artisans around the world. Each piece tells its own
            story—handcrafted with care, creativity, and tradition.
          </p>

          <p>
            <strong>Creator:</strong> This project was developed by <strong>Lydia Elli Giannoulatou</strong>—an artist
            at heart and a developer by passion. CeramiCo is a reflection of my journey to bring together the worlds of
            art, design, and code into one meaningful experience.
          </p>

          <h2 className="text-3xl font-display text-[#2F4138] mt-16">Our Mission</h2>
          <p>
            At CeramiCo, we believe in the enduring beauty of handmade pottery. Our mission is to support skilled
            artisans, promote creativity, and make authentic ceramics accessible to everyone. Through our workshops, we
            also aim to inspire others to get their hands dirty and connect with the timeless craft of pottery.
          </p>

          <h2 className="text-3xl font-display text-[#2F4138] mt-16">Image Credits</h2>
          <p>
            The gallery and workshop images used on this site are sourced from{" "}
            <a
              href="https://www.freepik.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2F4138] underline"
            >
              Freepik
            </a>
            , and the exhibition images are sourced from Google Images.
          </p>

          <h2 className="text-3xl font-display text-[#2F4138] mt-16">Contact Us</h2>
          <p>
            Have a question or just want to say hello? Feel free to{" "}
            <a href="/contact" className="text-[#2F4138] underline">
              get in touch
            </a>
            . We’d love to hear from you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
