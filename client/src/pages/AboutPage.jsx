import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">About CeramiCo</h1>

      <div className="text-lg space-y-6">
        <p>
          Welcome to <strong>CeramiCo</strong>, a unique online platform dedicated to bringing you high-quality, handmade pottery products. Whether you're a pottery enthusiast or someone looking to add a special touch to your home decor, CeramiCo offers a wide range of beautiful and authentic ceramic pieces.
        </p>
        <p>
          CeramiCo is more than just a store—it's also a place where you can unleash your creativity! We offer pottery workshops for individuals interested in learning the art of pottery and creating their own pieces.
        </p>
        <p>
          This website was created as part of a <strong>graduation project at Socialhackers Academy</strong>, aiming to combine the beauty of handmade pottery with modern e-commerce. As part of my journey as a developer, I wanted to create an online experience that merges art and technology, allowing people to discover the magic of pottery.
        </p>
        <p>
          The stunning handmade products featured on CeramiCo are sourced from <a href="https://www.giftedartisan.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">Gifted Artisan</a>, a platform that celebrates and promotes talented artisans who create authentic, handcrafted pottery. These products are crafted with love, care, and skill, and each piece tells a unique story.
        </p>
        <p>
          <strong>Creator:</strong> The website was developed by <strong>Lydia Elli Giannoulatou</strong>, a passionate individual who loves both technology and artistry. This project was my way of merging my interests in design, coding, and craftsmanship.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
        <p>
          At CeramiCo, we believe in the timeless beauty of handmade pottery. Our mission is to provide people with high-quality ceramic products while supporting local artisans. Through our workshops, we also aim to inspire others to create and explore their artistic potential.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
        <p>
          If you have any questions or inquiries, feel free to <a href="/contact" className="text-blue-500">reach out</a>. We would love to hear from you!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
