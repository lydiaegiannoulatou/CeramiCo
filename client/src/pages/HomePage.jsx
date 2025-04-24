import Gallery from "../components/Gallery";

const HomePage = () => {
  return (
    <>
      <div className="relative h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/drszm8sem/image/upload/v1744978827/monochromatic-still-life-composition-with-tableware_oc2kfe.jpg')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Text Content */}
        <div className="relative z-10 flex items-center justify-end h-full p-6 text-white">
          <div className="max-w-md text-right">
            <h1 className="text-4xl font-bold">Welcome to CeramiCo</h1>
            <p className="mt-2 text-lg">
              Where clay meets soul. <br />
              Explore handcrafted pottery made with intention, and join our
              workshops to shape your own story—one spin at a time.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Gallery />
      </div>
    </>
  );
};

export default HomePage;
